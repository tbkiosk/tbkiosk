import Joi from 'joi'
import { ObjectId } from 'mongodb'

import type { Dayjs } from 'dayjs'

export const PROJECT_TABLE = 'project'

export const projectFormSchema = Joi.object({
  projectName: Joi.string().required(),
  customURL: Joi.string(),
  description: Joi.string(),
  website: Joi.string(),
  twitter: Joi.string(),
  discord: Joi.string(),
  mintDate: Joi.date().required(),
  mintPrice: Joi.number().required().positive(),
  coinType: Joi.string().required(),
  totalSupply: Joi.number().positive().required(),
  profileImage: Joi.string().required(),
  bannerImage: Joi.string().required(),
})

export const projectDbSchema = projectFormSchema.append({
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
  creatorId: Joi.string().required(),
})

type ProjectBase = {
  projectName: string
  customURL?: string
  description?: string
  website?: string
  twitter?: string
  discord?: string
  profileImage: string
  bannerImage: string
}

export type ProjectForm = ProjectBase & {
  mintDate: Date | Dayjs
  mintPrice: string
  coinType: string
  totalSupply: string
}

export type ProjectData = ProjectBase & {
  mintDate: Date
  mintPrice: number
  coinType: string
  totalSupply: number
  createdTime: Date
  updatedTime: Date
  creatorId: ObjectId
}
