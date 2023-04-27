import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'
import type { AllowlistRawData } from '@/schemas/allowlist'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistRawData | boolean | null>>) => {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({
      message: 'Invalid projectId',
    })
  }

  const allowlistId = req.query.allowlistId
  if (!allowlistId || typeof allowlistId !== 'string') {
    return res.status(400).json({
      message: 'Invalid allowlistId',
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
   * allowlist by allowlistId
   */
  if (req.method === 'GET') {
    try {
      const result = await allowlistCollection.findOne({
        _id: new ObjectId(allowlistId),
        projectId: new ObjectId(projectId),
      })

      return res.status(200).json({
        data: result || null,
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  /**
   * @method DELETE
   * delete an allowedlist by allowlistId
   */
  if (req.method === 'DELETE') {
    try {
      const project = await projectCollection.findOne({
        _id: new ObjectId(projectId),
      })

      if (!project) {
        return res.status(400).json({
          message: 'Project not found',
        })
      }

      if (project.allowlists.map(_objectId => _objectId.toString()).indexOf(allowlistId) < 0) {
        return res.status(400).json({
          message: 'Allowlist does not exist in this project',
        })
      }

      if (project.creatorId.toString() !== session.user.id) {
        return res.status(403).json({
          message: "You cannnot operate other's project",
        })
      }
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }

    try {
      const transactionSession = client.startSession()

      await transactionSession.withTransaction(
        async () => {
          await projectCollection.updateOne(
            {
              _id: new ObjectId(projectId),
            },
            {
              $pull: {
                allowlists: new ObjectId(allowlistId),
              },
            }
          )

          await allowlistCollection.deleteOne({
            _id: new ObjectId(allowlistId),
          })
        },
        {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        }
      )

      return res.status(200).json({
        message: 'Failed to delete allowlist',
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
