import clientPromise from '@/lib/mongodb'

import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE } from '@/schemas/allowlist'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData, ProjectBase } from '@/schemas/project'
import type { AllowlistRawData } from '@/schemas/allowlist'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<(AllowlistRawData & { project: ProjectBase })[]>>) => {
  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const projectCollection = db.collection<ProjectData>(PROJECT_TABLE)
  const allowlistCollection = db.collection<AllowlistRawData>(ALLOWLIST_TABLE)

  /**
   * @method GET
   * @returns get all allowlists
   */
  if (req.method === 'GET') {
    try {
      const projects = await projectCollection.find().toArray()
      const allowlists = await allowlistCollection.find().toArray()
      const allowlistsWithProjectInfo = allowlists?.map(_allowlist => {
        const _project = projects.find(_project => _project._id.toString() === _allowlist.projectId.toString())
        if (!_project) throw new Error(`Failed to find the project information of allowlist ${_allowlist._id}. Please contract us.`)

        return {
          ..._allowlist,
          project: {
            projectType: _project.projectType,
            projectName: _project.projectName,
            customURL: _project.customURL,
            description: _project.description,
            website: _project.website,
            twitter: _project.twitter,
            discord: _project.discord,
            profileImage: _project.profileImage,
            bannerImage: _project.bannerImage,
          },
        }
      })

      return res.status(200).json({
        data: allowlistsWithProjectInfo || [],
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
