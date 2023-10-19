import { Goerli, Ethereum, Polygon } from '@thirdweb-dev/chains'

import { chain } from '@/constants/chain'

export const BeepContractAddress = {
  [Goerli.chainId]: '0x1993d975E209D54e0bb9E4AC1aB999D339B6DEd3',
  [Ethereum.chainId]: '0x86818Bf7d23FB9E588eFD5E927F6362E43244fa9',
  [Polygon.chainId]: '0x9cAc72EFe455ADb4f413A8592eD98f962B7bE293',
} as { [key: number]: `0x${string}` }

export const BeepTbaImplementationAddress = {
  [Goerli.chainId]: '0xF72E72F264DbEe03C0e6d39c866d950832A6480e',
  [Ethereum.chainId]: '0xF72E72F264DbEe03C0e6d39c866d950832A6480e',
  [Polygon.chainId]: '0xe6a82c6Fb09AD172E26B813dD9840344b5676588',
} as { [key: number]: `0x${string}` }

// TODO: Do not hardcode contract address and implementation address
export const CONTRACT_ADDRESS = BeepContractAddress[chain.chainId]
export const IMPLEMENTATION_ADDRESS = BeepTbaImplementationAddress[chain.chainId]
export const REGISTRY_ADDRESS = '0x02101dfB77FDE026414827Fdc604ddAF224F0921' as `0x${string}`
