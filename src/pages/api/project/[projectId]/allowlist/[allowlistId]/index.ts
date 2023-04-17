import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

// import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE, allowlistFormSchema } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
// import type { ProjectData } from '@/schemas/project'
import type { AllowlistData } from '@/schemas/allowlist'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<boolean | null>>) => {
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
   * @returns create a new allowlist referred to a project
   */
  if (req.method === 'GET') {
    const { error: formSchemaError } = allowlistFormSchema.validate(req.body)
    if (formSchemaError) {
      return res.status(400).send({
        message: formSchemaError.message || 'Invalid allowlist options',
      })
    }

    try {
      const result = await allowlistCollection.findOne({
        _id: new ObjectId(allowlistId),
      })

      if (!result) {
        return res.status(400).json({
          message: 'Allowlist not found',
        })
      }
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
