'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { goerli } from 'wagmi/chains'

const { publicClient, webSocketPublicClient } = configureChains([goerli], [publicProvider()])

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

const WagmiProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => (
  <WagmiConfig config={config}>{children}</WagmiConfig>
)

export default WagmiProvider
