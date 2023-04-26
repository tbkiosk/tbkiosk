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

const projectBaseSchema = Joi.object({
  projectType: Joi.string()
    .valid(...Object.values(projectTypes))
    .required(),
  projectName: Joi.string().required(),
  customURL: Joi.string().allow(''),
  description: Joi.string().required(),
  website: Joi.string().allow(''),
  twitter: Joi.string().allow(''),
  discord: Joi.string().allow(''),
  profileImage: Joi.string().required(),
  bannerImage: Joi.string().allow(''),
  mintDate: Joi.date(),
  coinType: Joi.string().required(),
})

export const projectFormSchema = projectBaseSchema.append({
  mintPrice: Joi.string().allow(''),
  totalSupply: Joi.string().allow(''),
})

export const projectDbSchema = projectBaseSchema.append({
  mintPrice: Joi.number().positive().strict(),
  totalSupply: Joi.number().integer().positive().strict(),
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
  creatorId: Joi.string().required(),
  allowlists: Joi.array().items(Joi.string()).default([]).required(),
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
  allowlists: ObjectId[]
}
