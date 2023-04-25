import Joi from 'joi'
import { ObjectId } from 'mongodb'

export const ALLOWLIST_TABLE = 'allowlist'

export enum AllocationMethod {
  FCFS = 'FCFS', // first come first serve
  Raffle = 'Raffle',
}

export enum CriteriaKeys {
  MINIMUN_TOKEN = 'MINIMUN_TOKEN',
  CONTRACT_ADDRESS = 'CONTRACT_ADDRESS',
  PROJECT_TWITTER_FOLLOWED = 'PROJECT_TWITTER_FOLLOWED',
  PROJECT_DISCORD_JOINED = 'PROJECT_DISCORD_JOINED',
}

type Criteria = Partial<{
  [CriteriaKeys.MINIMUN_TOKEN]: string | number
  [CriteriaKeys.CONTRACT_ADDRESS]: string
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
  amount: Joi.string().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_TOKEN]: Joi.number(),
    [CriteriaKeys.CONTRACT_ADDRESS]: Joi.string(),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
  allocationMethod: Joi.string().valid(...Object.values(AllocationMethod)),
})

export const allowlistFormSchema = allowlistBaseSchema

export const allowlistDBSchema = allowlistFormSchema.append({
  projectId: Joi.string().required(),
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
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
  [CriteriaKeys.MINIMUN_TOKEN]: undefined,
  [CriteriaKeys.CONTRACT_ADDRESS]: '',
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
