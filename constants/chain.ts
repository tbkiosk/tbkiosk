import { Ethereum, Sepolia } from '@thirdweb-dev/chains'

//TODO: switch to ethereum for production
export const chain = Sepolia

export const explorer = {
  [Sepolia.chainId]: 'https://sepolia.etherscan.io',
  [Ethereum.chainId]: 'https://etherscan.io',
} as const
