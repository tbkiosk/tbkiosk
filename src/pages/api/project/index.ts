import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import COS from 'cos-nodejs-sdk-v5'
import dayjs from 'dayjs'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE, projectFormSchema, projectCreationDbSchema } from '@/schemas/project'

import { copyTempImageToPersistentBucket } from '@/utils/cos'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'
import type { ProjectData } from '@/schemas/project'

const cos = new COS({
  SecretId: process.env.TENCENT_COS_SECRET_ID as string,
  SecretKey: process.env.TENCENT_COS_SECRET_KEY as string,
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
  const collection = db.collection<ProjectData>(PROJECT_TABLE)

  /**
   * @method GET
   * @returns projects created by the creator
   */
  if (req.method === 'GET') {
    try {
      const result = await collection
        .find({
          creatorId: new ObjectId(session.user.id),
        })
        .toArray()

      return res.status(200).json({
        data: result || [],
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
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

    const now = new Date()
    const transformedData: ProjectData = {
      ...req.body,
      mintDate: new Date(req.body.mintDate),
      mintPrice: +req.body.mintPrice || null,
      totalSupply: +req.body.totalSupply || null,
      createdTime: now,
      updatedTime: now,
      creatorId: session.user.id,
      allowlists: [],
    }

    const { error: dbSchemaError } = projectCreationDbSchema.validate(transformedData)
    console.log(333, transformedData)
    if (dbSchemaError) {
      return res.status(500).send({
        message: dbSchemaError.message || 'Failed to transform project data',
      })
    }

    try {
      await Promise.all([
        copyTempImageToPersistentBucket(transformedData.profileImage, cos),
        transformedData.bannerImage && copyTempImageToPersistentBucket(transformedData.bannerImage, cos),
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

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
