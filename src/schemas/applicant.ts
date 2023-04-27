import Joi from 'joi'
import { ObjectId } from 'mongodb'

export const APPLICANT_TABLE = 'applicant'

export enum ApplicantStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type Applicant = {
  userId?: ObjectId
  address: string
  allowlistId: ObjectId
  status: ApplicantStatus
  createdTime: Date
  updatedTime: Date
}

export enum ApplicationOperations {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  APPROVE_ALL = 'APPROVE_ALL',
  REJECT_ALL = 'REJECT_ALL',
}

export const appliantDBSchema = Joi.object({
  userId: Joi.string().optional(),
  address: Joi.string().required(),
  allowlistId: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(ApplicantStatus))
    .required(),
  createdTime: Joi.date().required(),
  updatedTime: Joi.date().required(),
})

export const applicantOperationSchema = Joi.object({
  address: Joi.string(),
  operation: Joi.string()
    .valid(...Object.values(ApplicationOperations))
    .required(),
})
