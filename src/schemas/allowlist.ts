import Joi from 'joi'
import { ObjectId } from 'mongodb'

export const ALLOWLIST_TABLE = 'allowlist'

export enum AllocationMethod {
  FCFS = 'FCFS', // first come first serve
  Raffle = 'Raffle',
}

export enum CriteriaKeys {
  MINIMUN_TOKEN_AND_ADDRESS = 'MINIMUN_TOKEN_AND_ADDRESS',
  PROJECT_TWITTER_FOLLOWED = 'PROJECT_TWITTER_FOLLOWED',
  PROJECT_DISCORD_JOINED = 'PROJECT_DISCORD_JOINED',
}

export type MininumTokenAndAddress = {
  contractAddress: string
  number: number | string
}

export type Criteria = Partial<{
  [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: MininumTokenAndAddress[]
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: boolean
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: boolean
}>

const allowlistBaseSchema = Joi.object({
  allocationMethod: Joi.string().valid(...Object.values(AllocationMethod)),
})

export const allowlistFormSchema = allowlistBaseSchema.append({
  amount: Joi.string().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: Joi.array().items({
      contractAddress: Joi.string().required(),
      number: Joi.string().required(),
    }),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
})

export const allowlistDBSchema = allowlistFormSchema.append({
  projectId: Joi.string().required(),
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
  amount: Joi.number().integer().min(1).strict().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: Joi.array().items({
      contractAddress: Joi.string().required(),
      number: Joi.number().integer().min(0).strict().required(),
    }),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
  applicants: Joi.array().items(Joi.string()).default([]).required(),
  approvees: Joi.array().items(Joi.string()).default([]).required(),
})

export type AllowlistForm = {
  amount: string
  criteria: Criteria
  allocationMethod: AllocationMethod
}

export type AllowlistRawData = {
  projectId: ObjectId
  createdTime: Date
  updatedTime: Date
  amount: number
  criteria: Criteria
  allocationMethod: AllocationMethod
  applicants: ObjectId[]
  approvees: ObjectId[]
}

export const CRITERIA_DEFAULT_VALUE = {
  [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: undefined,
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: true,
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: true,
}

export const criteriaDisplayText = {
  [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: 'Hold NFT/Token',
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: 'Join Discord server',
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: 'Follow Twitter',
}
