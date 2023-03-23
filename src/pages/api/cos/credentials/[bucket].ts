import { getServerSession } from 'next-auth/next'
import STS from 'qcloud-cos-sts'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { getCredential } from '@/utils/cos'

import { TENCENT_COS_BUCKET, TENCENT_COS_DEV_BUCKET, TENCENT_COS_TEMP_BUCKET } from '@/constants/cos'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<STS.CredentialData>>) => {
  const session: ExtendedSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({
      message: '',
    })
  }

  if (!session.user?.email) {
    return res.status(500).json({
      message: 'Missing user email in session, try to sign out and login',
    })
  }

  /**
   * @method GET
   * @returns user with discord or twitter email by provider in users collection
   */
  if (req.method === 'GET') {
    const {
      query: { bucket },
    } = req

    if ([TENCENT_COS_BUCKET, TENCENT_COS_DEV_BUCKET, TENCENT_COS_TEMP_BUCKET].indexOf(bucket as string) < 0) {
      return res.status(400).json({
        message: 'Unknown bucket',
      })
    }

    const credentials = await getCredential({
      bucket: bucket as string,
    })

    return res.status(200).json({
      data: credentials,
    })
  }

  return res.status(405).json({
    message: '',
  })
}

export default handler
