import STS from 'qcloud-cos-sts'

const CONFIG = {
  secretId: (process.env.TENCENT_COS_SECRET_ID as string) || 'AKIDyhCRZIXKXw71g1QLH5ey0e0iCPKttJ9k',
  secretKey: (process.env.TENCENT_COS_SECRET_KEY as string) || 'GNGtfEXkh17weDwShgAQRAUggfRQ9euu',
  durationSeconds: 1800,
  bucket: (process.env.TENCENT_COS_BUCKET as string) || 'morphis-img-dev-1256253626',
  region: (process.env.TENCENT_COS_REGION as string) || 'ap-singapore',
  allowPrefix: '',
}

const shortBucketName = CONFIG.bucket.substring(0, CONFIG.bucket.lastIndexOf('-'))
const appId = CONFIG.bucket.substring(1 + CONFIG.bucket.lastIndexOf('-'))

const POLICY = {
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
      resource: ['qcs::cos:' + CONFIG.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + CONFIG.allowPrefix],
    },
  ],
}

export const getCredential = async (): Promise<STS.CredentialData> =>
  new Promise((res, rej) => {
    STS.getCredential(
      {
        secretId: CONFIG.secretId,
        secretKey: CONFIG.secretKey,
        durationSeconds: 1800,
        policy: POLICY,
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
