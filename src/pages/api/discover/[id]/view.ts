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
   * @method PUT
   * @returns project view count plus
   */
  if (req.method === 'PUT') {
    const id = req.query.id as string

    // TODO: restrict API call only from same origin

    try {
      await prismaClient.project.update({ where: { id }, data: { viewCount: { increment: 1 } } })

      return res.status(200).json(null)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
