import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import COS from 'cos-nodejs-sdk-v5'
import dayjs from 'dayjs'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE, projectFormSchema, projectUpdateDbSchema } from '@/schemas/project'

import { copyTempImageToPersistentBucket } from '@/utils/cos'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { ProjectData } from '@/schemas/project'

const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID as string,
  SecretKey: process.env.TENCENT_COS_SECRET_KEY as string,
})

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<ProjectData | boolean | null>>) => {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({
      message: 'Invalid projectId',
    })
  }

  const session: ExtendedSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      message: '',
    })
  }

  if (!session.user?.id) {
    return res.status(500).json({
      message: 'Missing user in session, try to sign out and sign in again',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<ProjectData>(PROJECT_TABLE)

  /**
   * @method GET
   * @returns created projects
   */
  if (req.method === 'GET') {
    try {
      const result = await collection.findOne({
        _id: new ObjectId(projectId as string),
      })

      return res.status(200).json({
        data: result || null,
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }
  }

  /**
   * @method PUT
   * @returns update existing project
   */
  if (req.method === 'PUT') {
    try {
      const project = await collection.findOne({
        _id: new ObjectId(projectId),
      })

      if (!project) {
        return res.status(400).json({
          message: 'Project not found',
        })
      }

      if (project.creatorId.toString() !== session.user.id) {
        return res.status(403).json({
          message: "You cannnot update other's project",
        })
      }

      const { error: formSchemaError } = projectFormSchema.validate(req.body)
      if (formSchemaError) {
        return res.status(400).send({
          message: formSchemaError.message || 'Invalid project options',
        })
      }

      if (!dayjs(req.body.mintDate).isValid()) {
        return res.status(400).send({
          message: 'Invalid mint date format',
        })
      }

      const now = new Date()
      const transformedData: Omit<ProjectData, 'createdTime' | 'creatorId' | 'allowlists'> = {
        ...req.body,
        mintDate: new Date(req.body.mintDate),
        mintPrice: +req.body.mintPrice || null,
        totalSupply: +req.body.totalSupply || null,
        updatedTime: now,
      }

      const { error: dbSchemaError } = projectUpdateDbSchema.validate(transformedData)
      if (dbSchemaError) {
        return res.status(500).send({
          message: dbSchemaError.message || 'Failed to transform project data',
        })
      }

      await Promise.all([
        transformedData.profileImage === project.profileImage ? null : copyTempImageToPersistentBucket(transformedData.profileImage, cos),
        transformedData.bannerImage === project.bannerImage
          ? null
          : transformedData.bannerImage && copyTempImageToPersistentBucket(transformedData.bannerImage, cos),
        collection.updateOne(
          {
            _id: new ObjectId(projectId),
          },
          {
            $set: { ...transformedData },
          }
        ),
      ])

      return res.status(200).json({
        data: true,
        message: `Successfully updated project ${transformedData.projectName}`,
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
