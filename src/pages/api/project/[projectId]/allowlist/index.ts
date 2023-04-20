import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { ALLOWLIST_TABLE, allowlistFormSchema, allowlistDBSchema } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { AllowlistData } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistData[] | boolean>>) => {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({
      message: 'Invalid projectId',
    })
  }

  const session: ExtendedSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      message: '',
    })
  }

  if (!session.user?.id) {
    return res.status(500).json({
      message: 'Missing user in session, try to sign out and sign in again',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<AllowlistData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * @returns allowlists under the project
   */
  if (req.method === 'GET') {
    try {
      const result = await collection
        .find({
          projectId: new ObjectId(projectId),
        })
        .toArray()

      return res.status(200).json({
        data: result ?? [],
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  /**
   * @method POST
   * create a new allowlist
   */
  if (req.method === 'POST') {
    const { error: formSchemaError } = allowlistFormSchema.validate(req.body)
    if (formSchemaError) {
      return res.status(400).send({
        message: formSchemaError.message || 'Invalid allowlist options',
      })
    }

    const now = new Date()
    const transformedData: AllowlistData = {
      ...req.body,
      projectId,
      amount: +req.body.amount,
      applicants: [],
      createdTime: now,
      updatedTime: now,
    }

    const { error: dbSchemaError } = allowlistDBSchema.validate(transformedData)
    if (dbSchemaError) {
      return res.status(500).send({
        message: dbSchemaError.message || 'Failed to transform project data',
      })
    }

    try {
      await collection.insertOne({
        ...transformedData,
        projectId: new ObjectId(projectId),
      })

      return res.status(200).json({
        data: true,
        message: 'Created allowlist successfully',
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Failed to create project',
      })
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
