import { getServerSession } from 'next-auth/next'
import { ObjectId, UpdateResult } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE, applicationOperationSchema, ApplicantStatus, ApplicationOperations } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'
import type { AllowlistRawData, Applicant } from '@/schemas/allowlist'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<Applicant[] | boolean | null>>) => {
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

  try {
    const target = await projectCollection.findOne({
      _id: new ObjectId(projectId),
      creatorId: new ObjectId(session.user.id),
    })
    if (!target) {
      return res.status(403).json({
        message: 'Not allowed to check the allowlists not belong to you',
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: (err as Error)?.message || 'Interval server error',
    })
  }

  /**
   * @method GET
   * applicants in allowlist by allowlistId
   */
  if (req.method === 'GET') {
    try {
      const result = await allowlistCollection.findOne({
        _id: new ObjectId(allowlistId),
        projectId: new ObjectId(projectId),
      })

      if (!result) {
        return res.status(200).json({
          data: null,
        })
      }

      return res.status(200).json({
        data: result.applicants,
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  /**
   * @method PUT
   * approve/reject allowlist applications
   */
  if (req.method === 'PUT') {
    const { error } = applicationOperationSchema.validate(req.body)
    if (error) {
      return res.status(400).send({
        message: error.message || 'Invalid allowlist operation',
      })
    }

    const now = new Date()
    const isBatch = req.body.operation === ApplicationOperations.APPROVE_ALL || req.body.operation === ApplicationOperations.REJECT_ALL

    try {
      let result: undefined | UpdateResult

      if (isBatch) {
        result = await allowlistCollection.updateOne(
          { _id: new ObjectId(allowlistId), projectId: new ObjectId(projectId) },
          {
            $set: {
              'applicants.$[].status':
                req.body.operation === ApplicationOperations.APPROVE_ALL ? ApplicantStatus.APPROVED : ApplicantStatus.REJECTED,
              'applicants.$[].updatedTime': now,
            },
          }
        )
      } else {
        if (!req.body.address) {
          return res.status(400).send({
            message: 'Invalid address',
          })
        }

        const target = await allowlistCollection.findOne({
          _id: new ObjectId(allowlistId),
          projectId: new ObjectId(projectId),
          'applicants.address': req.body.address as string,
        })

        if (!target) {
          return res.status(400).json({
            message: 'There is no application of this address',
          })
        }

        // TODO: check if the address has already applied
        // const applicant = target.applicants.find(_applicant => _applicant.address === req.body.address)

        result = await allowlistCollection.updateOne(
          { _id: new ObjectId(allowlistId), projectId: new ObjectId(projectId), 'applicants.address': req.body.address },
          {
            $set: {
              'applicants.$.status':
                req.body.operation === ApplicationOperations.APPROVE ? ApplicantStatus.APPROVED : ApplicantStatus.REJECTED,
              'applicants.$.updatedTime': now,
            },
          }
        )
      }

      return res.status(200).json({
        data: result.acknowledged,
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
