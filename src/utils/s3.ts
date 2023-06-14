import { ListBucketsCommand } from '@aws-sdk/client-s3'

import { s3Client } from '@/lib/s3'

export const listBuckets = async () => {
  const command = new ListBucketsCommand({})
  const { Buckets } = await s3Client.send(command)

  return Buckets
}
