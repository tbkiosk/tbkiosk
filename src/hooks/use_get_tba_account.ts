import { useSigner } from '@thirdweb-dev/react'
import { TBVersion, TokenboundClient } from '@tokenbound/sdk'

import { env } from 'env.mjs'

type Props = {
  tokenId: string
  contractAddress: `0x${string}`
  implementationAddress: `0x${string}`
}

export const useGetTbaAccount = ({ tokenId, contractAddress, implementationAddress }: Props) => {
  const signer = useSigner()

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: +env.NEXT_PUBLIC_CHAIN_ID,
    implementationAddress,
    version: TBVersion.V2,
  })

  return tokenboundClient.getAccount({
    tokenContract: contractAddress,
    tokenId: tokenId,
  })
}
