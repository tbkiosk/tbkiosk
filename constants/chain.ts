import { Ethereum, Goerli } from '@thirdweb-dev/chains'

//TODO: switch to ethereum for production
export const chain = Goerli

export const explorer = {
  [Goerli.chainId]: 'https://goerli.etherscan.io',
  [Ethereum.chainId]: 'https://etherscan.io',
} as const
