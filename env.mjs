import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
    ALCHEMY_KEY: z.string().min(1),
    ETHERSCAN_KEY: z.string().min(1),
    POLYGONSCAN_KEY: z.string().min(1),
    SWAP_PRIVATE_KEY: z.string().min(1),
    COIN_GECKO_KEY: z.string().min(1),
    NEXT_PUBLIC_CHAIN_ID: z.enum(['1', '5', '137']),
    NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS: z.string().min(1).startsWith('0x'),
    NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS: z.string().min(1).startsWith('0x'),
    NEXT_PUBLIC_REGISTRY_ADDRESS: z.string().min(1).startsWith('0x'),
    NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS: z.string().min(1).startsWith('0x'),
  },
  client: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_CHAIN_ID: z.enum(['1', '5', '137']),
    NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS: z.string().min(1).startsWith('0x'),
    NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS: z.string().min(1).startsWith('0x'),
    NEXT_PUBLIC_REGISTRY_ADDRESS: z.string().min(1).startsWith('0x'),
    NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS: z.string().min(1).startsWith('0x'),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    ETHERSCAN_KEY: process.env.ETHERSCAN_KEY,
    POLYGONSCAN_KEY: process.env.POLYGONSCAN_KEY,
    SWAP_PRIVATE_KEY: process.env.SWAP_PRIVATE_KEY,
    SWAP_PRIVATE_KEY: process.env.COIN_GECKO_KEY,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS: process.env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS,
    NEXT_PUBLIC_REGISTRY_ADDRESS: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS,
    NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS,
  },
})
