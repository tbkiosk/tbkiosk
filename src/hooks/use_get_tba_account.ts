import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'

import { chain } from '../constants/chain'

type Props = {
  tokenId: string
  contractAddress: `0x${string}`
  implementationAddress: `0x${string}`
}

export const useGetTbaAccount = ({ tokenId, contractAddress, implementationAddress }: Props) => {
  const signer = useSigner()

  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId, implementationAddress })

  return tokenboundClient.getAccount({
    tokenContract: contractAddress,
    tokenId: tokenId,
  })
}
