import { EvmChain } from '@moralisweb3/common-evm-utils'

export const getChainByName = (name: string | undefined) => {
  if (!name) {
    return EvmChain.ETHEREUM
  }

  switch (name) {
    case 'Polygon': {
      return EvmChain.POLYGON
    }
    case 'Ethereum': {
      return EvmChain.ETHEREUM
    }
    default: {
      return EvmChain.ETHEREUM
    }
  }
}
