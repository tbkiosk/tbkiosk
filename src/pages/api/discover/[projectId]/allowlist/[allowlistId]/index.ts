import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'

import { ALLOWLIST_TABLE } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { AllowlistRawData } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistRawData | null>>) => {
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

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const allowlistCollection = db.collection<AllowlistRawData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * @returns allowlist by allowlistId
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

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
