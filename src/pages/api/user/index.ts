import { getServerSession } from 'next-auth/next'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedUser } from '@/schemas/user'
import type { ExtendedSession } from '@/helpers/nextauth/types'

type UserResponse = {
  discordEmail: string | null
  twitterEmail: string | null
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<UserResponse | null>>) => {
  const session: ExtendedSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      message: '',
    })
  }

  if (!session.user?.email) {
    return res.status(500).json({
      message: 'Missing user email in session, try to sign out and login',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<ExtendedUser>('users')

  /**
   * @method GET
   * @returns user with discord or twitter email by provider in users collection
   */
  if (req.method === 'GET') {
    const user = await collection.findOne({
      email: session.user?.email,
    })

    if (!user) {
      return res.status(500).json({
        message: 'User was not found. Please contact Morphis admin',
      })
    }

    return res.status(200).json({
      data: {
        discordEmail: user.discordEmail ?? null,
        twitterEmail: user.twitterEmail ?? null,
      },
    })
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
