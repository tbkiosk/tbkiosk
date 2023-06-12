import { getServerSession } from 'next-auth/next'

import { prismaClient } from '@/lib/prisma'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { User, Account } from '@prisma/client'

export type UserResponse = User & {
  accounts: Account[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<UserResponse | null>>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      message: '',
    })
  }

  /**
   * @method GET
   * @returns user with discord or twitter email by provider in users collection
   */
  if (req.method === 'GET') {
    const user = await prismaClient.user.findFirst({
      where: {
        id: session.user.id,
      },
    })
    if (!user) {
      return res.status(500).json({
        message: 'User was not found. Please contact us',
      })
    }

    const accounts = await prismaClient.account.findMany({
      where: {
        userId: user.id,
      },
    })
    if (!accounts?.length) {
      return res.status(500).json({
        message: 'Accounts were not found. Please contact us',
      })
    }

    return res.status(200).json({
      data: {
        ...user,
        accounts,
      },
    })
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
