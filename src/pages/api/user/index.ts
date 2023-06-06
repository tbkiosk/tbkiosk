import { ObjectId } from 'mongodb'
import { z } from 'zod'

import clientPromise from '@/lib/mongodb'

import { USERS_TABLE, type User, type Address } from '@/schemas/users'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<boolean>>) => {
  try {
    const client = await clientPromise
    const db = client.db(`${process.env.NODE_ENV}`)
    const collection = db.collection<User>(USERS_TABLE)

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

      const now = new Date()
      const addresses = req.body.addresses as Address[]

      const target = await collection.findOne({
        addresses: {
          $elemMatch: {
            $in: addresses,
          },
        },
      })

      if (!target) {
        // if target is not found, create a new one
        await collection.insertOne({
          primary_address: addresses[0],
          addresses: addresses,
          created_at: now,
          updated_at: now,
          twitter: null,
          discord: null,
        })
      } else {
        // if target is found, check addresses
        // if request addresses have some addresses which are not in target addresses, update target addresses
        const diff = addresses.filter(
          _address => !target.addresses.find(_addr => _addr.address === _address.address && _addr.chain === _address.chain)
        )

        if (diff.length > 0) {
          await collection.updateOne(
            { _id: new ObjectId(target._id) },
            {
              $push: {
                addresses: {
                  $each: diff,
                },
              },
            }
          )
        }
      }

      return res.status(200).json({
        data: true,
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
