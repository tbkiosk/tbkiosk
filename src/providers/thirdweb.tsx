'use client'

import { useState } from 'react'
import { ThirdwebProvider as _ThirdwebProvider } from '@thirdweb-dev/react'
import { Ethereum, Goerli, Polygon } from '@thirdweb-dev/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { env } from 'env.mjs'
import { chain } from '@/constants/chain'

const ThirdwebProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <_ThirdwebProvider
        activeChain={chain}
        clientId={env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        supportedChains={[Ethereum, Goerli, Polygon]}
      >
        {children}
      </_ThirdwebProvider>
    </QueryClientProvider>
  )
}

export default ThirdwebProvider
