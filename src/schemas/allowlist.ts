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

export const allowlistFormSchema = Joi.object({
  amount: Joi.string().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_NFT]: Joi.number(),
    [CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]: Joi.number(),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
  allocationMethod: Joi.string().valid(...Object.values(AllocationMethod)),
})

export const allowlistDBSchema = Joi.object({
  projectId: Joi.string().required(),
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
  amount: Joi.number().integer().required(),
  criteria: Joi.object({
    [CriteriaKeys.MINIMUN_NFT]: Joi.number(),
    [CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]: Joi.number(),
    [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: Joi.boolean(),
    [CriteriaKeys.PROJECT_DISCORD_JOINED]: Joi.boolean(),
  }),
  allocationMethod: Joi.string().valid(...Object.values(AllocationMethod)),
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
  [CriteriaKeys.MINIMUN_NFT]: 1,
  [CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]: 100,
  [CriteriaKeys.PROJECT_DISCORD_JOINED]: true,
  [CriteriaKeys.PROJECT_TWITTER_FOLLOWED]: true,
}

export const renderCriteriaText = (criteria: CriteriaKeys, content?: string | number | boolean) => {
  switch (criteria) {
    case CriteriaKeys.MINIMUN_NFT: {
      return `Have at least ${content ?? CRITERIA_DEFAULT_VALUE[CriteriaKeys.MINIMUN_NFT]} NFT in wallet`
    }
    case CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS: {
      return `Have at least ${content ?? CRITERIA_DEFAULT_VALUE[CriteriaKeys.MINIMUN_TWITTER_FOLLOWERS]} Followers on Twitter`
    }
    case CriteriaKeys.PROJECT_DISCORD_JOINED: {
      return `Follow ${content ? `@${content}` : ''} twitter`
    }
    case CriteriaKeys.PROJECT_TWITTER_FOLLOWED: {
      return 'Join Discord Server'
    }
    default: {
      return ''
    }
  }
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
