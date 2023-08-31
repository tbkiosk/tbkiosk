import { Sepolia, Ethereum } from '@thirdweb-dev/chains'

export const BeepContractAddress = {
  [Sepolia.chainId]: '0x79E0a7769F078A75F5AeFBCDd98cD94700329D6C',
  [Ethereum.chainId]: '0x79E0a7769F078A75F5AeFBCDd98cD94700329D6C',
} as const

export const BeepTbaImplementationAddress = {
  [Sepolia.chainId]: '0xd9a326f0ba21ef25663a0673874ee944658ba41b',
  [Ethereum.chainId]: '0xd9a326f0ba21ef25663a0673874ee944658ba41b',
} as const
