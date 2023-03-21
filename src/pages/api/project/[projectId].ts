import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { ProjectData } from '@/schemas/project'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<ProjectData | null>>) => {
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
      query: { creatorId, projectId },
    } = req

    try {
      const result = await collection.findOne({
        creatorId: new ObjectId((creatorId as string) || session.user.id),
        _id: new ObjectId(projectId as string),
      })

      return res.status(200).json({
        data: result ?? null,
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: '',
  })
}

export default handler
