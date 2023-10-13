import { Goerli, Ethereum } from '@thirdweb-dev/chains'

import { chain } from '@/constants/chain'

export const BeepContractAddress = {
  [Goerli.chainId]: '0xD9e27B5781639E002259f7CCA3326CF978274Ae2',
  [Ethereum.chainId]: '0xD9e27B5781639E002259f7CCA3326CF978274Ae2',
} as { [key: number]: `0x${string}` }

export const BeepTbaImplementationAddress = {
  [Goerli.chainId]: '0x55830df01D89923477F6650b39c65a03f3BB2c8c',
  [Ethereum.chainId]: '0x55830df01D89923477F6650b39c65a03f3BB2c8c',
} as { [key: number]: `0x${string}` }

// TODO: Do not hardcode contract address and implementation address
export const CONTRACT_ADDRESS = BeepContractAddress[chain.chainId]
export const IMPLEMENTATION_ADDRESS = BeepTbaImplementationAddress[chain.chainId]
export const REGISTRY_ADDRESS = '0x02101dfB77FDE026414827Fdc604ddAF224F0921' as `0x${string}`
