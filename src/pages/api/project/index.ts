import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import COS from 'cos-nodejs-sdk-v5'
import dayjs from 'dayjs'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { projectFormSchema, projectDbSchema } from '@/schemas/project'

import { TENCENT_COS_REGION, TENCENT_COS_TEMP_BUCKET, TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET } from '@/constants/cos'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { ProjectData } from '@/schemas/project'

const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID as string,
  SecretKey: process.env.TENCENT_COS_SECRET_KEY as string,
})

const copyTempImageToPersistentBucket = (fileName: string) =>
  new Promise<string>((resolve, reject) => {
    cos.putObjectCopy(
      {
        Bucket: process.env.NODE_ENV === 'production' ? TENCENT_COS_BUCKET : TENCENT_COS_DEV_BUCKET,
        Region: TENCENT_COS_REGION,
        Key: fileName,
        CopySource: `${TENCENT_COS_TEMP_BUCKET}.cos.${TENCENT_COS_REGION}.myqcloud.com/${encodeURIComponent(fileName)}`,
      },
      err => {
        if (err) {
          reject(err)
          return
        }

        resolve(fileName)
      }
    )
  })

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<ProjectData[] | boolean>>) => {
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
  const collection = db.collection<ProjectData>('project')

  /**
   * @method GET
   * @returns created projects
   */
  if (req.method === 'GET') {
    const {
      query: { creatorId },
    } = req

    try {
      const result = await collection
        .find({
          creatorId: new ObjectId((creatorId as string) || session.user.id),
        })
        .toArray()

      return res.status(200).json({
        data: result ?? [],
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  /**
   * @method POST
   * @returns create a new project
   */
  if (req.method === 'POST') {
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

    const now = +new Date()
    const transformedData: ProjectData = { ...req.body, createdTime: now, updatedTime: now, creatorId: session.user.id }

    const { error: dbSchemaError } = projectDbSchema.validate(transformedData)
    if (dbSchemaError) {
      return res.status(500).send({
        message: dbSchemaError.message || 'Failed to transform project data',
      })
    }

    try {
      await Promise.all([
        copyTempImageToPersistentBucket(transformedData.profileImage),
        copyTempImageToPersistentBucket(transformedData.bannerImage),
        collection.insertOne({ ...transformedData, creatorId: new ObjectId(transformedData.creatorId) }),
      ])

      return res.status(200).json({
        data: true,
        message: `Created project ${transformedData.projectName}`,
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Failed to create project',
      })
    }
  }

  /**
   * @method PUT
   * @returns update existing project
   */
  if (req.method === 'PUT') {
    const projectId = req.body.projectId
    if (!projectId) {
      return res.status(400).send({
        message: 'Missing projectId',
      })
    }

    try {
      const project = await collection.findOne({
        _id: new ObjectId(projectId as string),
      })
      if (!project) {
        return res.status(400).json({
          message: 'Project not found',
        })
      }

      if (project.creatorId.toString() !== session.user.id) {
        return res.status(401).json({
          message: "You cannnot update other creator's project",
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

      const now = +new Date()
      const transformedData: ProjectData = { ...req.body, updatedTime: now }

      await Promise.all([
        transformedData.profileImage === project.profileImage ? null : copyTempImageToPersistentBucket(transformedData.profileImage),
        transformedData.bannerImage === project.bannerImage ? null : copyTempImageToPersistentBucket(transformedData.bannerImage),
        collection.updateOne(
          {
            _id: new ObjectId(projectId),
          },
          {
            $set: transformedData,
          }
        ),
      ])

      return res.status(200).json({
        data: true,
        message: `Successfully updated project ${transformedData.projectName}`,
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message ?? 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: '',
  })
}

export default handler
