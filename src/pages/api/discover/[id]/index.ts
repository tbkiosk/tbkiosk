import { getServerSession } from 'next-auth/next'

import { mongodbClient } from '@/lib/mongodb'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Project } from '@/types/project'
import { ObjectId } from 'mongodb'

const handler = async (req: NextApiRequest, res: NextApiResponse<Project | null>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end()
  }

  /**
   * @method GET
   * @returns projects
   */
  if (req.method === 'GET') {
    const { id } = req.query

    try {
      const client = await mongodbClient
      const db = client.db(process.env.NODE_ENV)

      const project = await db.collection<Project>('creator_projects').findOne({ _id: new ObjectId(id as string) })

      return res.status(200).json(project)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
