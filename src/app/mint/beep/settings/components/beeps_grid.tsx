'use client'

import { useState } from 'react'
import { useChainId, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import clsx from 'clsx'

import { Spinner } from '@nextui-org/spinner'

import { BeepContractAddress } from '@/constants/beep'

const BeepsGrid = () => {
  const chainId = useChainId()

  if (!chainId) return null

  return <BeepsGridInner chainId={chainId} />
}

const BeepsGridInner = ({ chainId }: { chainId: number }) => {
  const address = useAddress()
  const { contract } = useContract(BeepContractAddress[chainId])
  const { data, isLoading, error } = useOwnedNFTs(contract, address)

  if (error) {
    return <p className="text-center">{(error as Error)?.message || 'Failed to load NFTs'}</p>
  }

  if (isLoading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  return (
    <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {data?.map(_nft => (
        <div
          className="relative aspect-square transition-transform hover:scale-[1.02]"
          key={_nft.metadata.id}
        >
          <a
            className="h-full w-full absolute inset-0 z-10"
            href={`/mint/beep/settings/${_nft.metadata.id}`}
            rel="noreferrer"
            target="_blank"
          />
          <BeepIframe src={`https://beep-iframe.vercel.app/${BeepContractAddress[chainId]}/${chainId}/${_nft.metadata.id}`} />
        </div>
      ))}
    </div>
  )
}

const BeepIframe = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="h-full w-full relative">
      {!loaded && (
        <div className="h-full w-full absolute flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}
      <iframe
        className={clsx('h-full w-full bg-black border-none rounded-xl opacity-0', loaded && 'opacity-100')}
        onLoad={() => setLoaded(true)}
        src={src}
        style={{ colorScheme: 'normal' }}
      />
    </div>
  )
}

export default BeepsGrid
