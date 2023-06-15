import { getServerSession } from 'next-auth/next'

import { prismaClient } from '@/lib/prisma'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { User, Account } from '@prisma/client'

export type UserResponse = User & {
  accounts: Account[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<UserResponse>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  /**
   * @method GET
   * @returns user and related accounts
   */
  if (req.method === 'GET') {
    const user = await prismaClient.user.findFirst({
      where: {
        id: session.user.id,
      },
    })
    if (!user) {
      return res.status(500).end('User was not found. Please contact us')
    }

    const accounts = await prismaClient.account.findMany({
      where: {
        userId: user.id,
      },
    })
    if (!accounts?.length) {
      return res.status(500).end('Accounts were not found. Please contact us')
    }

    return res.status(200).json({
      ...user,
      accounts,
    })
  }

  return res.status(405).end()
}

export default handler
