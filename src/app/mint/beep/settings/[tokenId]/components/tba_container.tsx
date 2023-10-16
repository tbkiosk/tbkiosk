'use client'

import { useMemo } from 'react'
import { useSigner, useChainId } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'

import BeepIframe from '../../components/beep_iframe'
import CopyButton from '@/components/copy_button'

import { CONTRACT_ADDRESS, IMPLEMENTATION_ADDRESS } from '@/constants/beep'
import { chain } from '@/constants/chain'

import { maskAddress } from '@/utils/address'

const TBAContainer = ({ tokenId }: { tokenId: string }) => {
  const signer = useSigner()
  const chainId = useChainId()

  const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })

  const tbaAddresss = useMemo(() => {
    return tokenboundClient.getAccount({
      tokenContract: CONTRACT_ADDRESS,
      tokenId: tokenId ?? '',
      implementationAddress: IMPLEMENTATION_ADDRESS,
    })
  }, [tokenId])

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 pt-8 md:pt-16">
      <div className="w-full md:w-[40%] aspect-square">
        <BeepIframe tokenId={tokenId} />
      </div>
      <div className="">
        <h1 className="mb-4 font-bold text-4xl">Set up your Beep</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium text-xl">Beep #{tokenId}</span>
          <CopyButton
            className="px-4 py-1 border border-[#a6a9ae] rounded-full font-normal text-sm text-[#a6a9ae] hover:border-[#666666]"
            copyText={tbaAddresss}
          >
            {maskAddress(tbaAddresss)}
          </CopyButton>
        </div>
      </div>
    </div>
  )
}

export default TBAContainer
