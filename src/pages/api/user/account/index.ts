import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

import { prismaClient } from '@/lib/prisma'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Account } from '@prisma/client'

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
      type: z.enum(['credentials']),
      chain: z.enum(['Ethereum']),
      address: z.string().min(1),
    })

    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).end(result.error)
    }

    try {
      const _account = await prismaClient.account.create({
        data: {
          userId: session.user.id,
          type: req.body.type,
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
      chain: z.enum(['Ethereum']),
      address: z.string().min(1),
    })

    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).end(result.error)
    }

    try {
      await prismaClient.account.delete({
        where: {
          provider_providerAccountId: {
            provider: req.body.chain,
            providerAccountId: req.body.address,
          },
        },
      })

      return res.status(200).end()
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
