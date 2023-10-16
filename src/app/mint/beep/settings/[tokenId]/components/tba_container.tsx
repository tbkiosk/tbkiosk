'use client'

import { useChainId, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'

import BeepIframe from '../../components/beep_iframe'

const TBAContainer = ({ tokenId }: { tokenId: string }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="aspect-square">
        <BeepIframe tokenId={tokenId} />
      </div>
      <div className=""></div>
    </div>
  )
}

export default TBAContainer
