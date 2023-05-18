import { MoralisNextApi } from '@moralisweb3/next'
import { env } from '@/env.mjs'

export default MoralisNextApi({ apiKey: env.MORALIS_API_KEY })
