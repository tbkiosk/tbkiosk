import { Ethereum, Goerli, Polygon } from '@thirdweb-dev/chains'

import { env } from 'env.mjs'

import USDC from 'public/icons/tokens/usdc.svg'
import BeepUSDC from 'public/icons/tokens/beep-usdc.svg'
import USDT from 'public/icons/tokens/usdt.svg'
import BeepUSDT from 'public/icons/tokens/beep-usdt.svg'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import BeepEth from 'public/icons/tokens/beep-eth.svg'
// import STEthereum from 'public/icons/tokens/steth.svg'

export const USDC_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [Goerli.chainId]: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  [Polygon.chainId]: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
}

export const USDT_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [Goerli.chainId]: '0x3c1373d16927748BBA6bEe77f14E174593616A7c',
  [Polygon.chainId]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
}

export const WETH_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [Goerli.chainId]: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  [Polygon.chainId]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
}

export const WSTETH_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  [Goerli.chainId]: '0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f',
  [Polygon.chainId]: '0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD',
}

export const WBTC_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  [Goerli.chainId]: '0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05',
  [Polygon.chainId]: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
}

export const UNI_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  [Goerli.chainId]: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  [Polygon.chainId]: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
}

export const LINK_CONTRACT_ADDRESS = {
  [Ethereum.chainId]: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  [Goerli.chainId]: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
  [Polygon.chainId]: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
}

export const USDC_DECIMAL = 6
export const USDT_DECIMAL = 6
export const WETH_DECIMAL = 18
export const WSTETH_DECIMAL = 18
export const WBTC_DECIMAL = 8
export const UNI_DECIMAL = 18
export const LINK_DECIMAL = 18

export const TOKENS_FROM = {
  [USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'USDC',
    fullName: 'USD Coin',
    address: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: USDC_DECIMAL,
    icon: () => <USDC />,
    beepIcon: () => <BeepUSDC />,
  },
  [USDT_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'USDT',
    fullName: 'Tether USD',
    address: USDT_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: USDT_DECIMAL,
    icon: () => <USDT />,
    beepIcon: () => <BeepUSDT />,
  },
}

export const TOKENS_TO = {
  [WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'WETH',
    fullName: 'Wrapped Ethereum',
    address: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: WETH_DECIMAL,
    icon: () => <EthereumCircle />,
    beepIcon: () => <BeepEth />,
  },
  // [WSTETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
  //   name: 'wstETH',
  //   fullName: "Lido's wrapped stETH",
  //   address: WSTETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  //   decimal: WSTETH_DECIMAL,
  //   icon: () => <STEthereum />,
  // },
}
