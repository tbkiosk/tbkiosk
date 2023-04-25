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

type Criteria = Partial<{
  [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: MininumTokenAndAddress[]
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: boolean
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: boolean
}>

export enum ApplicantStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type Applicant = {
  userId?: ObjectId
  address: string
  status: ApplicantStatus
  createdTime: Date
  updatedTime: Date
}

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
  applicants: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string(),
        address: Joi.string(),
        status: Joi.string().valid(...Object.values(ApplicantStatus)),
        createdTime: Joi.date(),
        updatedTime: Joi.date(),
      })
    )
    .default([])
    .required(),
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
  applicants: Applicant[]
}

export type AllowlistPreviewData = Omit<AllowlistRawData, 'applicants'> & { filled: number }

export const CRITERIA_DEFAULT_VALUE = {
  [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: undefined,
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: true,
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: true,
}

export enum ApplicationOperations {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  APPROVE_ALL = 'APPROVE_ALL',
  REJECT_ALL = 'REJECT_ALL',
}

export const applicationOperationSchema = Joi.object({
  address: Joi.string(),
  operation: Joi.string()
    .valid(...Object.values(ApplicationOperations))
    .required(),
})

export const criteriaDisplayText = {
  [CriteriaKeys.MINIMUN_TOKEN_AND_ADDRESS]: 'Hold NFT/Token',
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: 'Follow Discord',
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: 'Follow Twitter',
}
