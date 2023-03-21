import * as Joi from 'joi'
import { ObjectId } from 'mongodb'

export const projectFormSchema = Joi.object({
  projectName: Joi.string().required(),
  customURL: Joi.string(),
  description: Joi.string(),
  website: Joi.string(),
  twitter: Joi.string(),
  discord: Joi.string(),
  mintDate: Joi.number().required(),
  mintPrice: Joi.number().required().positive(),
  coinType: Joi.string().required(),
  totalSupply: Joi.number().positive().required(),
})

export const projectDbSchema = projectFormSchema.append({
  createdTime: Joi.number().required(),
  updatedTime: Joi.number().required(),
  creatorId: Joi.string().required(),
})

type ProjectBase = {
  projectName: string
  customURL?: string
  description?: string
  website?: string
  twitter?: string
  discord?: string
}

export type ProjectForm = ProjectBase & {
  mintDate: string
  mintPrice: string
  coinType: string
  totalSupply: string
}

export type ProjectData = ProjectBase & {
  mintDate: number
  mintPrice: number
  coinType: string
  totalSupply: number
  createdTime: number
  updatedTime: number
  creatorId: ObjectId
}

export type ProjectDataWithId = ProjectData & { _id: string }
