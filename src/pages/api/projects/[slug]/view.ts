import { prismaClient } from '@/lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<null>) => {
  /**
   * @method PUT
   * @returns project view count plus
   */
  if (req.method === 'PUT') {
    const slug = req.query.slug as string

    // TODO: restrict API call only from same origin

    try {
      await prismaClient.project.update({ where: { slug }, data: { viewCount: { increment: 1 } } })

      return res.status(200).json(null)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
