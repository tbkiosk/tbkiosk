import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE, ApplicantStatus } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'
import type { AllowlistRawData, AllowlistPreviewData } from '@/schemas/allowlist'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistPreviewData | boolean | null>>) => {
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
   * allowlist by allowlistId
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

      const { applicants, ...rest } = result
      return res.status(200).json({
        data: { ...rest, filled: applicants.filter(_applicant => _applicant.status === ApplicantStatus.APPROVED).length },
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
