import { WithId } from 'mongodb'
import { z } from 'zod'

import clientPromise from '@/lib/mongodb'

import { USERS_TABLE, type User } from '@/schemas/users'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<boolean>>) => {
  try {
    const client = await clientPromise
    const db = client.db(`${process.env.NODE_ENV}`)
    const collection = db.collection<WithId<User>>(USERS_TABLE)

    if (req.method === 'POST') {
      const validationResult = z
        .object({
          addresses: z
            .array(
              z.object({
                chain: z.enum(['ETH', 'SUI']),
                address: z.string(),
              })
            )
            .min(1),
        })
        .safeParse(req.body)

      if (!validationResult.success) {
        return res.status(400).json({
          message: 'Invalid addresses',
        })
      }

      return res.status(200).json({
        data: true,
      })
    }

    return res.status(405).json({
      message: 'Method not allowed',
    })
  } catch (err) {
    return res.status(500).json({
      message: (err as Error)?.message || 'Internal Server Error',
    })
  }
}

export default handler
