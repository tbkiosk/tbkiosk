import clientPromise from '@/lib/mongodb'

import { PROJECT_TABLE } from '@/schemas/project'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<ProjectData[]>>) => {
  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<ProjectData>(PROJECT_TABLE)

  /**
   * @method GET
   * @returns projects created by the creator
   */
  if (req.method === 'GET') {
    try {
      const result = await collection.find().toArray()

      return res.status(200).json({
        data: result ?? [],
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
