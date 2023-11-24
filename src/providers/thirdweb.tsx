'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThirdwebProvider as _ThirdwebProvider } from '@thirdweb-dev/react'
import { Ethereum, Goerli, Polygon, Sepolia } from '@thirdweb-dev/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { env } from 'env.mjs'

const ThirdwebProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [currentChainId, setCurrentChainId] = useState(+env.NEXT_PUBLIC_CHAIN_ID)

  const pathname = usePathname()

  useEffect(() => {
    if (pathname.includes('scroller')) {
      setCurrentChainId(+env.NEXT_PUBLIC_CHAIN_ID_SCROLLER)
    } else {
      setCurrentChainId(+env.NEXT_PUBLIC_CHAIN_ID)
    }
  }, [pathname])

  return (
    <QueryClientProvider client={queryClient}>
      <_ThirdwebProvider
        activeChain={currentChainId}
        clientId={env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        supportedChains={[Ethereum, Goerli, Polygon, Sepolia]}
      >
        {children}
      </_ThirdwebProvider>
    </QueryClientProvider>
  )
}

export default ThirdwebProvider
