import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'

import { ALLOWLIST_TABLE, ApplicantStatus } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { AllowlistRawData, Applicant } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<boolean>>) => {
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
   * @method PUT
   * @returns apply for a allowlist by allowlistId
   */
  if (req.method === 'PUT') {
    if (!req.body.address || typeof req.body.address !== 'string') {
      return res.status(400).send({
        message: 'Invalid address',
      })
    }

    const now = new Date()
    const newApplicant: Applicant = {
      address: req.body.address,
      status: ApplicantStatus.PENDING,
      createdTime: now,
      updatedTime: now,
    }

    try {
      const result = await allowlistCollection.updateOne(
        {
          _id: new ObjectId(allowlistId),
          projectId: new ObjectId(projectId),
        },
        {
          $push: {
            applicants: newApplicant,
          },
        }
      )

      return res.status(200).send({
        data: result.acknowledged,
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
