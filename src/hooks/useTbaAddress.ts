import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'

import { env } from 'env.mjs'

const useTbaAddress = (tokenId: string): `0x${string}` => {
  const signer = useSigner()

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: 1,
    implementationAddress: '0xB9A74fea948e8d5699Df97DC114938Bee97813a8', // Implementation
    registryAddress: '0x02101dfb77fde026414827fdc604ddaf224f0921', // Registry
  })

  return tokenboundClient.getAccount({
    tokenContract: '0x9cAc72EFe455ADb4f413A8592eD98f962B7bE293', // NFT
    tokenId,
  })
}

export default useTbaAddress
