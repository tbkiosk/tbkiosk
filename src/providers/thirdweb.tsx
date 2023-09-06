'use client'

import { useState } from 'react'
import { ThirdwebProvider as _ThirdwebProvider } from '@thirdweb-dev/react'
import { Ethereum, Goerli } from '@thirdweb-dev/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, sepolia, goerli, polygon, polygonMumbai } from 'wagmi/chains'

import { env } from 'env.mjs'
import { chain } from '@/constants/chain'

const ThirdwebProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <_ThirdwebProvider
        activeChain={chain}
        clientId={env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        supportedChains={[Ethereum, Goerli]}
      >
        {children}
      </_ThirdwebProvider>
    </QueryClientProvider>
  )
}

export default ThirdwebProvider
