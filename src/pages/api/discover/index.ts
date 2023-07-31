import { getServerSession } from 'next-auth/next'

import { mongodbClient } from '@/lib/mongodb'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { WithId } from 'mongodb'

export type Project = WithId<{
  blockchain: string
  name: string
  logoUrl: string
  description: string
  website?: string
  twitter?: string
  discord?: string
  bannerImage: string
  categories: string[]
  previewImages: string[]
  projectStage: string
  status: string
  reportedAsSpam: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}>

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
      const client = await mongodbClient
      const db = client.db('development')

      const projects = await db.collection<Project>('creator_projects').find({}).toArray()

      return res.status(200).json(projects)
    } catch (err) {
      return res.status(500).end((err as Error)?.message)
    }
  }

  return res.status(405).end()
}

export default handler
