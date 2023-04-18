import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'

import { PROJECT_TABLE } from '@/schemas/project'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<ProjectData | null>>) => {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({
      message: 'Invalid projectId',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<ProjectData>(PROJECT_TABLE)

  /**
   * @method GET
   * @returns created projects
   */
  if (req.method === 'GET') {
    try {
      const result = await collection.findOne({
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
    message: 'Method now allowed',
  })
}

export default handler
