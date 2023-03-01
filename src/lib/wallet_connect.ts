import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { evmos, mainnet, polygon } from 'wagmi/chains'

const chains = [evmos, mainnet, polygon]

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: 'e1b06f3326e6315db629550035607ce9' }),
])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: 'e1b06f3326e6315db629550035607ce9',
    version: '1', // or "2"
    appName: 'web3Modal',
    chains,
  }),
  provider,
})

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains)
