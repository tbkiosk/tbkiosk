import Joi from 'joi'
import { ObjectId } from 'mongodb'

import type { Dayjs } from 'dayjs'

export const PROJECT_TABLE = 'project'

export enum projectTypes {
  Airdrop = 'Airdrop',
  'NFT Mint' = 'NFT Mint',
  Discount = 'Discount',
  Event = 'Event',
  Merch = 'Merch',
  Other = 'Other',
}

export const projectFormSchema = Joi.object({
  projectType: Joi.string()
    .valid(...Object.values(projectTypes))
    .required(),
  projectName: Joi.string().required(),
  customURL: Joi.string().allow(''),
  description: Joi.string().required(),
  website: Joi.string().allow(''),
  twitter: Joi.string().allow(''),
  discord: Joi.string().allow(''),
  mintDate: Joi.date(),
  mintPrice: Joi.number().positive(),
  coinType: Joi.string(),
  totalSupply: Joi.number().integer().positive(),
  profileImage: Joi.string().required(),
  bannerImage: Joi.string().allow(''),
})

export const projectDbSchema = projectFormSchema.append({
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
  creatorId: Joi.string().required(),
})

type ProjectBase = {
  projectType: projectTypes
  projectName: string
  customURL?: string
  description: string
  website?: string
  twitter?: string
  discord?: string
  profileImage: string
  bannerImage?: string
}

export type ProjectForm = ProjectBase & {
  mintDate?: Date | Dayjs
  mintPrice?: string
  coinType: string
  totalSupply?: string
}

export type ProjectData = ProjectBase & {
  mintDate?: Date
  mintPrice?: number
  coinType: string
  totalSupply?: number
  createdTime: Date
  updatedTime: Date
  creatorId: ObjectId
}
