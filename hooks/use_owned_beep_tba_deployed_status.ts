import { useState, useEffect } from 'react'
import { useAddress, useSigner, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS } from 'constants/beep'
import { chain } from 'constants/chain'

type ButtonStatus = 'Loading' | 'Deployed' | 'NotDeployed' | 'Error' | 'NoToken'

type UseOwnedBeepTbaDeployedStatusProps = {
  lastOwned?: boolean
  tokenId?: string
}
export const useOwnedBeepTbaDeployedStatus = ({ lastOwned, tokenId }: UseOwnedBeepTbaDeployedStatusProps) => {
  const address = useAddress()
  const signer = useSigner()
  const { contract } = useContract(CONTRACT_ADDRESS)
  const { data, isLoading } = useOwnedNFTs(contract, address)
  const ownedNFTs = data?.map(nft => nft.metadata.id)
  const nft = lastOwned ? ownedNFTs?.[ownedNFTs.length - 1] : ownedNFTs?.find(_nft => _nft === tokenId)

  const [accountDeployedStatus, setAccountDeployedStatus] = useState<ButtonStatus>('Loading')

  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })

  const checkAccountDeployment = async (tokenId: string) => {
    const tokenBoundAccount = tokenboundClient.getAccount({
      tokenContract: CONTRACT_ADDRESS,
      tokenId: tokenId,
      implementationAddress: IMPLEMENTATION_ADDRESS,
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
