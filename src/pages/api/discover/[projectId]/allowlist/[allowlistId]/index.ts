import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'

import { ALLOWLIST_TABLE } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { AllowlistData } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<AllowlistData | null>>) => {
  const allowlistId = req.query.allowlistId
  if (!allowlistId || typeof allowlistId !== 'string') {
    return res.status(400).json({
      message: 'Invalid allowlistId',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const allowlistCollection = db.collection<AllowlistData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * @returns allowlist by allowlistId
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
   * @method POST
   * apply for a allowlist
   */
  // if (req.method === 'POST') {
  //   if (!req.body.address) {
  //     return res.status(400).json({
  //       message: 'Missing address',
  //     })
  //   }

  //   try {
  //     const result = await allowlistCollection.findOne({
  //       _id: new ObjectId(allowlistId),
  //     })
  //     if (!result) {
  //       return res.status(400).json({
  //         message: 'Allowlist not found',
  //       })
  //     }

  //     const now = new Date()
  //     const applicant: Applicant = {
  //       address: req.body.address,
  //       status: ApplicantStatus.PENDING,
  //       createdTime: now,
  //       updatedTime: now,
  //     }

  //     await allowlistCollection.updateOne(
  //       {
  //         _id: new ObjectId(allowlistId),
  //       },
  //       {
  //         $push: {
  //           applicants: applicant,
  //         },
  //       }
  //     )
  //   } catch (err) {
  //     return res.status(500).json({
  //       message: (err as Error)?.message ?? 'Interval server error',
  //     })
  //   }
  // }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
