import COS from 'cos-js-sdk-v5'

import { getCredential } from '@/utils/cos'

export const cos = new COS({
  getAuthorization: async (options, callback) => {
    const res = await getCredential()

    callback({
      TmpSecretId: res.credentials.tmpSecretId,
      TmpSecretKey: res.credentials.tmpSecretKey,
      SecurityToken: res.credentials.sessionToken,
      StartTime: res.startTime,
      ExpiredTime: res.expiredTime,
    })
  },
})
