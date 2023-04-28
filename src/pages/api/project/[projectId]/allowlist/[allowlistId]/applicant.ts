import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { PROJECT_TABLE } from '@/schemas/project'
import { ALLOWLIST_TABLE } from '@/schemas/allowlist'
import { APPLICANT_TABLE, ApplicationOperations, applicantOperationSchema, ApplicantStatus } from '@/schemas/applicant'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'
import type { AllowlistRawData } from '@/schemas/allowlist'
import type { Applicant } from '@/schemas/applicant'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<Applicant[] | boolean | null>>) => {
  const projectId = req.query.projectId
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({
      message: 'Invalid projectId',
    })
  }

  const allowlistId = req.query.allowlistId
  if (!allowlistId || typeof allowlistId !== 'string') {
    return res.status(400).json({
      message: 'Invalid allowlistId',
    })
  }

  const session: ExtendedSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      message: '',
    })
  }

  if (!session.user?.id) {
    return res.status(500).json({
      message: 'Missing user in session, try to sign out and sign in again',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const projectCollection = db.collection<ProjectData>(PROJECT_TABLE)
  const allowlistCollection = db.collection<AllowlistRawData>(ALLOWLIST_TABLE)
  const applicantCollection = db.collection<Applicant>(APPLICANT_TABLE)

  let allowlist: AllowlistRawData | null = null

  try {
    const project = await projectCollection.findOne({
      _id: new ObjectId(projectId),
    })

    if (!project) {
      return res.status(400).json({
        message: 'Project not found',
      })
    }

    if (project.creatorId.toString() !== session.user.id) {
      return res.status(403).json({
        message: '',
      })
    }

    allowlist = await allowlistCollection.findOne<AllowlistRawData>({
      _id: new ObjectId(allowlistId),
    })

    if (!allowlist) {
      return res.status(400).json({
        message: 'Allowlist not found',
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: (err as Error)?.message || 'Interval server error',
    })
  }

  /**
   * @method GET
   * applicants in allowlist by allowlistId
   */
  if (req.method === 'GET') {
    try {
      const result = await applicantCollection
        .find({
          allowlistId: new ObjectId(allowlistId),
        })
        .toArray()

      return res.status(200).json({
        data: result || [],
      })
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }
  }

  /**
   * @method PUT
   * approve/reject allowlist applicants
   */
  if (req.method === 'PUT') {
    const { error } = applicantOperationSchema.validate(req.body)
    if (error) {
      return res.status(400).send({
        message: error.message || 'Invalid operation',
      })
    }

    try {
      switch (req.body.operation as ApplicationOperations) {
        // For APPROVE_ALL
        // 1. check if there are enough seats for all 'PENDING' applicants
        // 2. set all 'PENDING' applicant 'APPROVED'
        // 3. update related allowlist field 'applicants' and 'approvees'
        case ApplicationOperations.APPROVE_ALL: {
          const pendingAndApprovedApplicants = await applicantCollection
            .find({ status: { $in: [ApplicantStatus.APPROVED, ApplicantStatus.PENDING] } })
            .toArray()
          if (pendingAndApprovedApplicants.length > allowlist.amount) {
            return res.status(400).send({
              message: 'Not enough vacancy to approve all',
            })
          }

          const now = new Date()
          const transactionSession = client.startSession()

          await transactionSession.withTransaction(
            async () => {
              await applicantCollection.updateMany(
                { status: ApplicantStatus.PENDING },
                {
                  $set: { status: ApplicantStatus.APPROVED, updatedTime: now },
                }
              )

              const approvedApplicants = await applicantCollection.find({ status: ApplicantStatus.APPROVED }).toArray()

              await allowlistCollection.updateOne(
                {
                  _id: new ObjectId(allowlistId),
                },
                {
                  $set: {
                    applicants: [],
                    approvees: approvedApplicants.map(_applicant => _applicant._id),
                    updatedTime: now,
                  },
                }
              )
            },
            {
              readPreference: 'primary',
              readConcern: { level: 'local' },
              writeConcern: { w: 'majority' },
            }
          )

          return res.status(200).json({
            data: true,
          })
        }
        case ApplicationOperations.APPROVE: {
          // For APPROVE
          // 1. check if applicant is PENDING
          // 2. check if there are enough seat for one more applicant
          // 3. set target 'PENDING' applicant 'APPROVED'
          // 4. update related allowlist field 'applicants' and 'approvees'
          if (!req.body.address) {
            return res.status(400).send({
              message: 'Invalid address',
            })
          }

          const approvedApplicants = await applicantCollection.find({ status: ApplicantStatus.APPROVED }).toArray()
          if (approvedApplicants.length >= allowlist.amount) {
            return res.status(400).send({
              message: 'Not enough vacancy',
            })
          }

          const address = req.body.address as string
          const now = new Date()
          const transactionSession = client.startSession()

          await transactionSession.withTransaction(
            async () => {
              const { upsertedId } = await applicantCollection.updateOne(
                { address },
                {
                  $set: { status: ApplicantStatus.APPROVED, updatedTime: now },
                }
              )

              if (!upsertedId) {
                throw new Error('Failed to approve')
              }

              await allowlistCollection.updateOne(
                {
                  _id: new ObjectId(allowlistId),
                },
                {
                  $pull: {
                    applicants: upsertedId,
                  },
                  $push: {
                    approvees: upsertedId,
                  },
                  $set: {
                    updatedTime: now,
                  },
                }
              )
            },
            {
              readPreference: 'primary',
              readConcern: { level: 'local' },
              writeConcern: { w: 'majority' },
            }
          )

          return res.status(200).json({
            data: true,
          })
        }
        case ApplicationOperations.REJECT_ALL: {
          // For REJECT_ALL
          // 1. set all 'PENDING' applicant 'REJECTED'
          // 2. update related allowlist field 'applicants'
          const now = new Date()
          const transactionSession = client.startSession()

          await transactionSession.withTransaction(
            async () => {
              await applicantCollection.updateMany(
                { status: ApplicantStatus.PENDING },
                {
                  $set: { status: ApplicantStatus.REJECTED, updatedTime: now },
                }
              )

              await allowlistCollection.updateOne(
                {
                  _id: new ObjectId(allowlistId),
                },
                {
                  $set: {
                    applicants: [],
                    updatedTime: now,
                  },
                }
              )
            },
            {
              readPreference: 'primary',
              readConcern: { level: 'local' },
              writeConcern: { w: 'majority' },
            }
          )

          return res.status(200).json({
            data: true,
          })
        }
        case ApplicationOperations.REJECT: {
          // For REJECT
          // 1. set target 'PENDING' applicant 'REJECTED'
          // 2. update related allowlist field 'applicants'
          if (!req.body.address) {
            return res.status(400).send({
              message: 'Invalid address',
            })
          }

          const address = req.body.address as string
          const now = new Date()
          const transactionSession = client.startSession()

          await transactionSession.withTransaction(
            async () => {
              const { upsertedId } = await applicantCollection.updateOne(
                { address },
                {
                  $set: { status: ApplicantStatus.REJECTED, updatedTime: now },
                }
              )

              if (!upsertedId) {
                throw new Error('Failed to approve')
              }

              await allowlistCollection.updateOne(
                {
                  _id: new ObjectId(allowlistId),
                },
                {
                  $pull: {
                    applicants: upsertedId,
                  },
                  $set: {
                    updatedTime: now,
                  },
                }
              )
            },
            {
              readPreference: 'primary',
              readConcern: { level: 'local' },
              writeConcern: { w: 'majority' },
            }
          )

          return res.status(200).json({
            data: true,
          })
        }
        default: {
          return res.status(400).send({
            message: 'Invalid operation',
          })
        }
      }
    } catch (err) {
      return res.status(500).json({
        message: (err as Error)?.message || 'Interval server error',
      })
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  })
}

export default handler
