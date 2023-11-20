import { Ethereum, Goerli, Polygon, Sepolia } from '@thirdweb-dev/chains'

export const explorer = {
  [Goerli.chainId]: 'https://goerli.etherscan.io',
  [Ethereum.chainId]: 'https://etherscan.io',
  [Polygon.chainId]: 'https://polygonscan.com',
  [Sepolia.chainId]: 'https://sepolia.etherscan.io',
}
