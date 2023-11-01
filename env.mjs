import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
    ALCHEMY_KEY: z.string().min(1),
    ETHERSCAN_KEY: z.string().min(1),
    POLYGONSCAN_KEY: z.string().min(1),
    NEXT_PUBLIC_CHAIN_ID: z.string().min(1),
    NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_REGISTRY_ADDRESS: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_CHAIN_ID: z.string().min(1),
    NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_REGISTRY_ADDRESS: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    ETHERSCAN_KEY: process.env.ETHERSCAN_KEY,
    POLYGONSCAN_KEY: process.env.POLYGONSCAN_KEY,
    NEXT_PUBLIC_CHAIN_ID: z.string().min(1),
    NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_REGISTRY_ADDRESS: z.string().min(1),
  },
})
