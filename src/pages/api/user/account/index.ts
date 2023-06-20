import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { prismaClient } from '@/lib/prisma'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Account } from '@prisma/client'

export type AccountCreateReq = {
  chain: string
  address: string
  signature: string
}

export type AccountDeleteReq = {
  id: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Account>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  /**
   * @method POST
   * connect an account
   * @returns null
   */
  if (req.method === 'POST') {
    const schema = z.object({
      chain: z.enum(['Ethereum']),
      address: z.string().min(1),
      signature: z.string().min(1),
    })

    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res
        .status(400)
        .end(Object.entries(result.error.flatten().fieldErrors).reduce((acc, cur) => `${cur[0]}:${cur[1].toString()}.`, ''))
    }

    try {
      const target = await prismaClient.account.findFirst({
        where: {
          provider: req.body.chain,
          providerAccountId: req.body.address,
        },
      })

      if (target) {
        return res.status(400).end(`Address ${req.body.address} has already been connected`)
      }

      const _account = await prismaClient.account.create({
        data: {
          userId: session.user.id,
          type: 'credentials',
          provider: req.body.chain,
          providerAccountId: req.body.address,
          isPrimary: false,
        },
      })

      return res.status(200).json(_account)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  /**
   * @method DELETE
   * disconnect an account
   * @returns null
   */
  if (req.method === 'DELETE') {
    const schema = z.object({
      id: z.string().min(1),
    })

    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res
        .status(400)
        .end(Object.entries(result.error.flatten().fieldErrors).reduce((acc, cur) => `${cur[0]}:${cur[1].toString()}.`, ''))
    }

    try {
      const _account = await prismaClient.account.delete({
        where: {
          id: req.query.id as string,
        },
      })

      return res.status(200).json(_account)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
