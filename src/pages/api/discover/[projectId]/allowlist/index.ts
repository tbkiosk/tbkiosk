import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'

import { ALLOWLIST_TABLE } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { AllowlistRawData } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistRawData[]>>) => {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({
      message: 'Invalid projectId',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<AllowlistRawData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * @returns allowlists under the project
   */
  if (req.method === 'GET') {
    try {
      const result = await collection
        .find({
          projectId: new ObjectId(projectId),
        })
        .toArray()

      return res.status(200).json({
        data: result || [],
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
