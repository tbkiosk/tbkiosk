import Joi from 'joi'
import { ObjectId } from 'mongodb'

export const ALLOWLIST_TABLE = 'allowlist'

export enum AllocationMethod {
  FCFS = 'FCFS', // first come first serve
  Raffle = 'Raffle',
}

export enum CriteriaKeys {
  MINIMUN_NFT = 'MINIMUN_NFT',
  MINIMUN_TWITTER_FOLLOWERS = 'MINIMUN_TWITTER_FOLLOWERS',
  PROJECT_TWITTER_FOLLOWED = 'PROJECT_TWITTER_FOLLOWED',
  PROJECT_DISCORD_JOINED = 'PROJECT_DISCORD_JOINED',
}

type Criteria = Partial<{
  [CriteriaKeys.MINIMUN_NFT]: string | number
  [CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]: string | number
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: boolean
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: boolean
}>

type Applicant = {
  userId?: ObjectId
  address: string
  approved: boolean
  approvedTime: number
  updateTime: number
}

export const allowlistFormSchema = Joi.object({
  amount: Joi.string().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_NFT]: Joi.string(),
    [CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]: Joi.string(),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
  allocationMethod: Joi.string().valid(...Object.values(AllocationMethod)),
})

export const allowlistDBSchema = Joi.object({
  projectId: Joi.string().required(),
  createdTime: Joi.number().required(),
  updatedTime: Joi.number().required(),
  amount: Joi.number().integer().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_NFT]: Joi.string(),
    [CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]: Joi.string(),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
  allocationMethod: Joi.string().valid(...Object.values(AllocationMethod)),
  applicants: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string(),
        address: Joi.string(),
        approved: Joi.boolean(),
        approvedTime: Joi.number(),
        updateTime: Joi.number(),
      })
    )
    .default([])
    .required(),
})

export type AllowlistForm = {
  amount: string
  criteria: Criteria[]
  allocationMethod: AllocationMethod
}

export type AllowlistData = {
  projectId: ObjectId
  createdTime: number
  updatedTime: number
  amount: number
  criteria: Criteria[]
  allocationMethod: AllocationMethod
  applicants: Applicant[]
}
