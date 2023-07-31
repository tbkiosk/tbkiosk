import { getServerSession } from 'next-auth/next'

import { prismaClient } from '@/lib/prisma'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Project } from '@prisma/client'

const handler = async (req: NextApiRequest, res: NextApiResponse<Project[]>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  /**
   * @method GET
   * @returns projects
   */
  if (req.method === 'GET') {
    try {
      const projects = await prismaClient.project.findMany({})

      return res.status(200).json(projects)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
