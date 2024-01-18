import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'

import { env } from 'env.mjs'

const useTbaAddress = (tokenId: string): `0x${string}` => {
  const signer = useSigner()

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: +env.NEXT_PUBLIC_CHAIN_ID_MAINNET,
    implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS_MAINNET as `0x${string}`,
    registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS_MAINNET as `0x${string}`,
  })

  return tokenboundClient.getAccount({
    tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS_MAINNET as `0x${string}`,
    tokenId,
  })
}

export default useTbaAddress
