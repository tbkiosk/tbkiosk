import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { evmos, mainnet, polygon } from 'wagmi/chains'

const chains = [evmos, mainnet, polygon]

// Wagmi client
const { provider } = configureChains(chains, [
  w3mProvider({
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  }),
])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    version: 2, // Minimum version of wagmi 0.11.3 is required to use version: "2"
    chains,
  }),
  provider,
})

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains)
