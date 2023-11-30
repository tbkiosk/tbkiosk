import { Alchemy, Network } from 'alchemy-sdk'

import { env } from 'env.mjs'

const CHAIN_NETWORK_MAP = {
  '1': Network.ETH_MAINNET,
  '5': Network.ETH_GOERLI,
  '137': Network.MATIC_MAINNET,
  '11155111': Network.ETH_SEPOLIA,
}

export const alchemy = new Alchemy({
  apiKey: env.ALCHEMY_KEY,
  network: CHAIN_NETWORK_MAP[env.NEXT_PUBLIC_CHAIN_ID],
})

export const alchemyScoller = new Alchemy({
  apiKey: env.ALCHEMY_KEY,
  network: CHAIN_NETWORK_MAP[env.NEXT_PUBLIC_CHAIN_ID_SCROLLER],
})
