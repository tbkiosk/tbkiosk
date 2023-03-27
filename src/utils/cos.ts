import STS from 'qcloud-cos-sts'
import COS from 'cos-nodejs-sdk-v5'

import { TENCENT_COS_REGION, TENCENT_COS_TEMP_BUCKET, TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET } from '@/constants/cos'

const DEFAULT_TEMP_CREDENTIAL_DURATION = 600

type GetCredential = {
  bucket?: string
}

export const getCredential = async ({ bucket }: GetCredential = {}): Promise<STS.CredentialData> =>
  new Promise((res, rej) => {
    const _bucket = bucket || TENCENT_COS_TEMP_BUCKET
    const shortBucketName = _bucket.substring(0, _bucket.lastIndexOf('-'))
    const appId = _bucket.substring(1 + _bucket.lastIndexOf('-'))
    const allowPrefix = '*'

    STS.getCredential(
      {
        secretId: process.env.TENCENT_COS_SECRET_ID as string,
        secretKey: process.env.TENCENT_COS_SECRET_KEY as string,
        durationSeconds: DEFAULT_TEMP_CREDENTIAL_DURATION,
        policy: {
          version: '2.0',
          statement: [
            {
              action: [
                'name/cos:PutObject',
                'name/cos:PostObject',
                'name/cos:InitiateMultipartUpload',
                'name/cos:ListMultipartUploads',
                'name/cos:ListParts',
                'name/cos:UploadPart',
                'name/cos:CompleteMultipartUpload',
              ],
              effect: 'allow',
              principal: { qcs: ['*'] },
              resource: [
                'qcs::cos:' + TENCENT_COS_REGION + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + allowPrefix,
              ],
            },
          ],
        },
      },
      function (err, credential) {
        if (err) {
          rej(err)
          return
        }

        res(credential)
      }
    )
  })

export const copyTempImageToPersistentBucket = (fileName: string, cos: COS) =>
  new Promise<string>((resolve, reject) => {
    cos.putObjectCopy(
      {
        Bucket: process.env.NODE_ENV === 'production' ? TENCENT_COS_BUCKET : TENCENT_COS_DEV_BUCKET,
        Region: TENCENT_COS_REGION,
        Key: fileName,
        CopySource: `${TENCENT_COS_TEMP_BUCKET}.cos.${TENCENT_COS_REGION}.myqcloud.com/${encodeURIComponent(fileName)}`,
      },
      err => {
        if (err) {
          reject(err)
          return
        }

        resolve(fileName)
      }
    )
  })
