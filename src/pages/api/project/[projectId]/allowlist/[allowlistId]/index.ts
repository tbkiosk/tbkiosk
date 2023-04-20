import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { ALLOWLIST_TABLE, applicationOperationSchema, ApplicantStatus, ApplicationOperations } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { AllowlistData } from '@/schemas/allowlist'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistData | boolean | null>>) => {
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
  const allowlistCollection = db.collection<AllowlistData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * allowlist by allowlistId
   */
  if (req.method === 'GET') {
    try {
      const result = await allowlistCollection.findOne({
        _id: new ObjectId(allowlistId),
      })

      return res.status(200).json({
        data: result,
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
      if (isBatch) {
        await allowlistCollection.updateOne(
          { _id: new ObjectId(allowlistId) },
          {
            $set: {
              'applicants.$[].status':
                req.body.operation === ApplicationOperations.APPROVE_ALL ? ApplicantStatus.APPROVED : ApplicantStatus.REJECTED,
              'applicants.$[].updatedTime': now,
            },
          }
        )
      } else {
        await allowlistCollection.updateOne(
          { _id: new ObjectId(allowlistId), 'applicants.address': req.body.address as string },
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
        data: true,
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
      const { acknowledged } = await allowlistCollection.deleteOne({
        _id: new ObjectId(allowlistId),
      })

      if (acknowledged) {
        return res.status(200).json({
          data: true,
        })
      }

      return res.status(500).json({
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
