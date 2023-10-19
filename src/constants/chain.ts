import { Ethereum, Goerli, Polygon } from '@thirdweb-dev/chains'

//TODO: switch to ethereum for production
export const chain = Polygon

export const explorer = {
  [Goerli.chainId]: 'https://goerli.etherscan.io',
  [Ethereum.chainId]: 'https://etherscan.io',
  [Polygon.chainId]: 'https://polygonscan.com',
} as const
