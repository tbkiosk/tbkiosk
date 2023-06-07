import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    MONGO_USER: z.string().min(1),
    MONGO_PASS: z.string().min(1),
    TENCENT_COS_SECRET_ID: z.string().min(1),
    TENCENT_COS_SECRET_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
    TENCENT_COS_SECRET_ID: process.env.TENCENT_COS_SECRET_ID,
    TENCENT_COS_SECRET_KEY: process.env.TENCENT_COS_SECRET_KEY,
  },
})
