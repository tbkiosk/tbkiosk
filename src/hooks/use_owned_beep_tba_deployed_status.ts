import { useState, useEffect } from 'react'
import { useAddress, useSigner, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TBVersion, TokenboundClient } from '@tokenbound/sdk'

import { env } from 'env.mjs'

type ButtonStatus = 'Loading' | 'Deployed' | 'NotDeployed' | 'Error' | 'NoToken'

type UseOwnedBeepTbaDeployedStatusProps = {
  lastOwned?: boolean
  tokenId?: string
}
export const useOwnedBeepTbaDeployedStatus = ({ lastOwned, tokenId }: UseOwnedBeepTbaDeployedStatusProps) => {
  const address = useAddress()
  const signer = useSigner()
  const { contract } = useContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS)
  const { data, isLoading } = useOwnedNFTs(contract, address)
  const ownedNFTs = data?.map(nft => nft.metadata.id)
  const nft = lastOwned ? ownedNFTs?.[ownedNFTs.length - 1] : ownedNFTs?.find(_nft => _nft === tokenId)

  const [accountDeployedStatus, setAccountDeployedStatus] = useState<ButtonStatus>('Loading')

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: +env.NEXT_PUBLIC_CHAIN_ID,
    implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
    version: TBVersion.V2,
  })

  const checkAccountDeployment = async (tokenId: string) => {
    const tokenBoundAccount = tokenboundClient.getAccount({
      tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS as `0x${string}`,
      tokenId: tokenId,
    })

    if (signer?.provider) {
      const contractByteCode = await signer.provider.getCode(tokenBoundAccount)
      if (contractByteCode === '0x') {
        setAccountDeployedStatus('NotDeployed')
      } else {
        setAccountDeployedStatus('Deployed')
      }
    }
  }

  useEffect(() => {
    if (isLoading) return
    if (nft) {
      checkAccountDeployment(nft.toString()).catch(e => {
        console.error(e)
        setAccountDeployedStatus('Error')
      })
    } else {
      setAccountDeployedStatus('NoToken')
    }
  }, [nft, isLoading])

  return {
    status: accountDeployedStatus,
    nft,
    setAccountDeployedStatus,
  }
}
