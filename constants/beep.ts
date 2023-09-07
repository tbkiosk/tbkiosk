import { Goerli, Ethereum } from '@thirdweb-dev/chains'

import { chain } from 'constants/chain'

export const BeepContractAddress = {
  [Goerli.chainId]: '0xd600e1a922fFF055Dfd7ce298DB30Bf3AD377F7c',
  [Ethereum.chainId]: '0xd600e1a922fFF055Dfd7ce298DB30Bf3AD377F7c',
} as { [key: number]: `0x${string}` }

export const BeepTbaImplementationAddress = {
  [Goerli.chainId]: '0x55830df01D89923477F6650b39c65a03f3BB2c8c',
  [Ethereum.chainId]: '0x55830df01D89923477F6650b39c65a03f3BB2c8c',
} as { [key: number]: `0x${string}` }

// TODO: Do not hardcode contract address and implementation address
export const CONTRACT_ADDRESS = BeepContractAddress[chain.chainId]
export const IMPLEMENTATION_ADDRESS = BeepTbaImplementationAddress[chain.chainId]
