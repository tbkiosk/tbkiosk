import { z } from 'zod'

import clientPromise from '@/lib/mongodb'

import { USERS_TABLE, type User, type Address } from '@/schemas/users'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<User>>) => {
  try {
    const client = await clientPromise
    const db = client.db(`${process.env.NODE_ENV}`)
    const collection = db.collection<User>(USERS_TABLE)

    /**
     * GET method should not have request body, so we get the user information by POST /me, where the addresses can be appended in the body
     */
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

      const addresses = req.body.addresses as Address[]

      const target = await collection.findOne({
        addresses: {
          $elemMatch: {
            $in: addresses,
          },
        },
      })

      if (!target) {
        return res.status(200).json({
          message: 'User not found',
        })
      }

      return res.status(200).json({
        data: target,
      })
    }

    return res.status(405).json({
      message: 'Method Not Allowed',
    })
  } catch (err) {
    return res.status(500).json({
      message: (err as Error)?.message || 'Internal Server Error',
    })
  }
}

export default handler
