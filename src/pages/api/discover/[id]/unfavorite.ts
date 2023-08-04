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
   * @method DELETE
   * add favorite project to user
   */
  if (req.method === 'DELETE') {
    const id = req.query.id as string

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          id: session.user.id,
        },
      })
      if (!user) throw new Error('User not found')

      await prismaClient.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          likedProjects: user?.likedProjects?.filter(_lp => _lp !== id) || [],
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
