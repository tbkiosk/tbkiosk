'use client'

import Link from 'next/link'
import { useConnectionStatus, useChainId, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/spinner'

import ConnectWalletButton from '@/components/connect_wallet_button'
import BeepIframe from './beep_iframe'

import { BeepContractAddress } from '@/constants/beep'

import ChevronRight from 'public/icons/chevron-right.svg'

const BeepsGrid = () => {
  const connectionStatus = useConnectionStatus()
  const chainId = useChainId()
  const address = useAddress()
  const { contract } = useContract(chainId ? BeepContractAddress[chainId] : null)
  const { data, isLoading, error } = useOwnedNFTs(contract, address)

  if (connectionStatus === 'disconnected') {
    return (
      <div className="min-h-[540px] flex flex-col items-center justify-center gap-4 tracking-wide">
        <p className="font-[pixeloid-mono] text-sm text-center">Connect wallet to view your Beeps</p>
        <ConnectWalletButton
          className="!bg-transparent !font-medium !text-[#78edc1] [&>div>span:first-child]:text-[#78edc1]"
          style={{ border: '1px solid #78edc1' }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[540px] flex items-center justify-center">
        <p className="text-center">{(error as Error)?.message || 'Failed to load NFTs'}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[540px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  if (!chainId) return null

  if (!data?.length) {
    return (
      <div className="min-h-[540px] flex flex-col items-center justify-center gap-4 tracking-wide">
        <p className="font-[pixeloid-mono] text-sm text-center">Looks like you don’t have any Beep bot</p>
        <Link
          className="px-8 py-2 font-medium text-[#78edc1] border border-[#78edc1] rounded-lg"
          href="/mint/beep"
        >
          Mint Beep
        </Link>
      </div>
    )
  }

  return (
    <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data?.map(_nft => (
        <div
          className="relative aspect-square group transition-transform hover:scale-[1.02] group"
          key={_nft.metadata.id}
        >
          <Link
            className="h-full md:h-12 w-full md:w-12 absolute md:top-[10%] md:right-[10%] hidden group-hover:block z-10"
            href={`/mint/beep/settings/${_nft.metadata.id}`}
          >
            <div className="h-full w-full hidden md:flex justify-center items-center bg-white text-black rounded-full opacity-50">
              <span className="h-8 w-8">
                <ChevronRight />
              </span>
            </div>
          </Link>

          <BeepIframe tokenId={_nft.metadata.id} />
        </div>
      ))}
    </div>
  )
}

export default BeepsGrid
