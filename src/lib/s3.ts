import { S3Client } from '@aws-sdk/client-s3'

import { env } from '@/env.mjs'
import { AWS_S3_REGION } from '@/constants/cos'

export const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_SECRET_ID,
    secretAccessKey: env.AWS_S3_SECRET_KEY,
  },
})
