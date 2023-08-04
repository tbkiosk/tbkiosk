import { getServerSession } from 'next-auth/next'

import { prismaClient } from '@/lib/prisma'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<null>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  /**
   * @method POST
   * add favorite project to user
   */
  if (req.method === 'POST') {
    const id = req.query.id as string

    try {
      await prismaClient.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          likedProjects: { push: id },
        },
      })

      return res.status(200).json(null)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
