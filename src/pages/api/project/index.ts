import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { projectFormSchema, projectDbSchema } from '@/schemas/project'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { ProjectData } from '@/schemas/project'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<ProjectData[] | boolean>>) => {
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
  const collection = db.collection<ProjectData>('project')

  /**
   * @method GET
   * @returns created projects
   */
  if (req.method === 'GET') {
    const {
      query: { creatorId },
    } = req

    try {
      const result = await collection
        .find({
          creatorId: new ObjectId((creatorId as string) || session.user.id),
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
   * @returns create a new project
   */
  if (req.method === 'POST') {
    const { error: formSchemaError } = projectFormSchema.validate(req.body)
    if (formSchemaError) {
      return res.status(400).send({
        message: formSchemaError.message || 'Invalid project options',
      })
    }

    const now = +new Date()
    const transformedData: ProjectData = { ...req.body, createdTime: now, updatedTime: now, creatorId: session.user.id }

    const { error: dbSchemaError } = projectDbSchema.validate(transformedData)
    if (dbSchemaError) {
      return res.status(500).send({
        message: dbSchemaError.message || 'Failed to transform project data',
      })
    }

    try {
      await collection.insertOne({ ...transformedData, creatorId: new ObjectId(transformedData.creatorId) })

      return res.status(200).json({
        data: true,
        message: `Created project ${transformedData.projectName}`,
      })
    } catch (err) {
      return res.status(500).json({
        data: false,
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: '',
  })
}

export default handler
