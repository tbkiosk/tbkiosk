import { prismaClient } from '@/lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Project } from '@prisma/client'

const handler = async (req: NextApiRequest, res: NextApiResponse<Project | null>) => {
  /**
   * @method GET
   * @returns projects
   */
  if (req.method === 'GET') {
    const id = req.query.id as string

    try {
      const project = await prismaClient.project.findFirst({
        where: { id },
      })

      return res.status(200).json(project)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
