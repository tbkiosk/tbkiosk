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
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload',
      ],
      effect: 'allow',
      principal: { qcs: ['*'] },
      resource: ['qcs::cos:' + CONFIG.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + CONFIG.allowPrefix],
      // condition生效条件，关于 condition 的详细设置规则和COS支持的condition类型可以参考https://cloud.tencent.com/document/product/436/71306
      // 'condition': {
      //   // 比如限定ip访问
      //   'ip_equal': {
      //     'qcs:ip': '10.121.2.10/24'
      //   }
      // }
    },
  ],
}

export const getCredential = async () =>
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
