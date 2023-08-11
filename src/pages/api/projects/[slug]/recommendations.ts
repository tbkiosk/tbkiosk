import { prismaClient } from '@/lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Project } from '@prisma/client'

const DEFAULT_RECOMMENDATIONS = 6

const handler = async (req: NextApiRequest, res: NextApiResponse<Project[]>) => {
  /**
   * @method GET
   * @returns projects
   */
  if (req.method === 'GET') {
    try {
      const slug = req.query.slug as string
      const limit = req.query.limit

      if (typeof limit !== 'string' && typeof limit !== 'undefined') {
        throw new Error('Invalid limit parameter')
      }

      const currentProject = await prismaClient.project.findFirst({
        where: { slug },
      })

      if (!currentProject) {
        throw new Error('Project not found')
      }

      const projects = await prismaClient.project.findMany({
        where: {
          id: {
            not: {
              equals: currentProject.id,
            },
          },
          OR: [
            {
              categories: {
                hasSome: currentProject.categories,
              },
            },
            {
              blockchains: {
                hasSome: currentProject.blockchains,
              },
            },
          ],
        },
        take: +(limit || DEFAULT_RECOMMENDATIONS),
      })

      return res.status(200).json(projects)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
