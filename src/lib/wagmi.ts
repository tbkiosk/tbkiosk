import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { env } from '@/env.mjs'

const { chains, publicClient } = configureChains([mainnet, polygon], [publicProvider()])
const { connectors } = getDefaultWallets({
  appName: 'Morphis Airdawg',
  projectId: env.WALLET_CONNECT_PROJECT_ID,
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})
