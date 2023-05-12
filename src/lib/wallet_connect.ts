import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from 'wagmi'
import { evmos, mainnet, polygon } from 'wagmi/chains'

const chains = [evmos, mainnet, polygon]
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)
