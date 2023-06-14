import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
    TWITTER_CLIENT_ID: z.string().min(1),
    TWITTER_CLIENT_SECRET: z.string().min(1),
    AWS_S3_SECRET_ID: z.string().min(1),
    AWS_S3_SECRET_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
    AWS_S3_SECRET_ID: process.env.AWS_S3_SECRET_ID,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
  },
})
