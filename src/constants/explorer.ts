import { Ethereum, Goerli, Polygon, Sepolia } from '@thirdweb-dev/chains'

export const EXPLORER = {
  [Goerli.chainId]: 'https://goerli.etherscan.io',
  [Ethereum.chainId]: 'https://etherscan.io',
  [Polygon.chainId]: 'https://polygonscan.com',
  [Sepolia.chainId]: 'http://sepolia.etherscan.io',
}

export const API_SCAN = {
  [Goerli.chainId]: 'https://api-goerli.etherscan.io/api',
  [Ethereum.chainId]: 'https://api.etherscan.io/api',
  [Polygon.chainId]: 'https://api.polygonscan.com/api',
  [Sepolia.chainId]: 'http://api-sepolia.etherscan.io/api',
}
