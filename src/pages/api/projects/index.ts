import { prismaClient } from '@/lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Project } from '@prisma/client'

const handler = async (req: NextApiRequest, res: NextApiResponse<Project[]>) => {
  /**
   * @method GET
   * @returns projects
   */
  if (req.method === 'GET') {
    try {
      const { search, limit } = req.query
      if (Array.isArray(search) || Array.isArray(limit)) {
        throw new Error('Multiple search parameters is not supported')
      }

      const projects = await prismaClient.project.findMany({
        where: {
          OR: [{ name: { contains: search || '' } }],
        },
        take: limit ? +limit : undefined,
      })

      return res.status(200).json(projects)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
