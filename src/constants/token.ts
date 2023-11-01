import { Ethereum, Goerli, Polygon } from '@thirdweb-dev/chains'

export const USDC_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [Goerli.chainId]: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  [Polygon.chainId]: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
}

export const WETH_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [Goerli.chainId]: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  [Polygon.chainId]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
}

export const USDC_DECIMAL = 6
export const WETH_DECIMAL = 18
