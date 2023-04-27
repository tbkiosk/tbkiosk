import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE, allowlistFormSchema, allowlistDBSchema, CriteriaKeys, MAX_NFT_HOLD_CONDITIONS } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { ProjectData } from '@/schemas/project'
import type { AllowlistRawData, MininumTokenAndAddress } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistRawData[] | boolean>>) => {
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
  const projectCollection = db.collection<ProjectData>(PROJECT_TABLE)
  const allowlistCollection = db.collection<AllowlistRawData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * @returns allowlists under the project
   */
  if (req.method === 'GET') {
    try {
      const allowlist = await allowlistCollection
        .find({
          projectId: new ObjectId(projectId),
        })
        .toArray()

      return res.status(200).json({
        data: allowlist || [],
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
    try {
      const project = await projectCollection.findOne({
        _id: new ObjectId(projectId),
      })

      if (!project) {
        return res.status(400).json({
          message: 'Project not found',
        })
      }

      if (project.creatorId.toString() !== session.user.id) {
        return res.status(403).json({
          message: "You cannnot update other creator's project",
        })
      }
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }

    const { error: formSchemaError } = allowlistFormSchema.validate(req.body)
    if (formSchemaError) {
      return res.status(400).send({
        message: formSchemaError.message || 'Invalid allowlist options',
      })
    }

    if (req.body.criteria[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]?.length > MAX_NFT_HOLD_CONDITIONS) {
      return res.status(400).send({
        message: `NFT/token holding condition shoule not be greater than ${MAX_NFT_HOLD_CONDITIONS}`,
      })
    }

    const now = new Date()
    const transformedData = {
      ...req.body,
      projectId,
      amount: +req.body.amount,
      criteria: {
        ...req.body.criteria,
        ...(req.body.criteria?.[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]?.length
          ? {
              [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: (
                req.body.criteria[CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS] as MininumTokenAndAddress[]
              ).map(_minAndAddress => ({
                ..._minAndAddress,
                number: +_minAndAddress.number,
              })),
            }
          : null),
      },
      applicants: [],
      approvees: [],
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
      const transactionSession = client.startSession()

      await transactionSession.withTransaction(
        async () => {
          const newAllowlist = await allowlistCollection.insertOne({
            ...transformedData,
            projectId: new ObjectId(projectId),
          })

          await projectCollection.updateOne(
            {
              _id: new ObjectId(projectId),
            },
            {
              $push: {
                allowlists: newAllowlist.insertedId,
              },
            }
          )
        },
        {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        }
      )

      return res.status(200).json({
        data: true,
        message: 'Created allowlist successfully',
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Failed to create project',
      })
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
