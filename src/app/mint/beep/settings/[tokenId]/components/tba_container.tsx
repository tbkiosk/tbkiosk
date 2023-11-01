'use client'

import { useMemo } from 'react'
import { useSigner, useAddress, useChainId, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TBVersion, TokenboundClient } from '@tokenbound/sdk'
import { Spinner } from '@nextui-org/react'

import BeepIframe from '../../components/beep_iframe'
import CopyButton from '@/components/copy_button'
import DepositButton from './deposit_button'
import WithdrawButton from './withdraw_button'
import BeepSettingsPanel from './beep_settings_panel'

import { env } from 'env.mjs'

import { maskAddress } from '@/utils/address'
import TbaRecord from '@/app/mint/beep/settings/[tokenId]/components/tba_record'

const TBAContainer = ({ tokenId }: { tokenId: string }) => {
  const address = useAddress()
  const signer = useSigner()
  const chainId = useChainId()
  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS : null)
  const { data, isLoading, error } = useOwnedNFTs(contract, address)

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: +env.NEXT_PUBLIC_CHAIN_ID,
    implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
    version: TBVersion.V2,
  })

  const tbaAddress = useMemo(() => {
    return tokenboundClient.getAccount({
      tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS as `0x${string}`,
      tokenId: tokenId ?? '',
    })
  }, [tokenId])

  if (!chainId || +chainId !== +env.NEXT_PUBLIC_CHAIN_ID) {
    return null
  }

  if (error) {
    return <p className="text-center">{(error as Error)?.message || 'Failed to load NFT'}</p>
  }

  if (isLoading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  if (!data) return <p className="text-center">No NFTs found</p>

  if (!data.find(_data => _data.metadata.id === tokenId)) return <p className="text-center">This TBA is not owned by you</p>

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 pt-8 md:pt-16">
        <div className="w-full md:w-[40%] flex justify-center md:justify-end shrink-0">
          <div className="max-h-full aspect-square overflow-hidden">
            <BeepIframe tokenId={tokenId} />
          </div>
        </div>
        <div className="w-full max-w-[534px]">
          <h1 className="mb-4 font-bold text-4xl">Set up your Beep</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-xl">Beep #{tokenId}</span>
            <CopyButton
              className="px-4 py-1 border border-[#a6a9ae] rounded-full font-normal text-sm text-[#a6a9ae] hover:border-[#666666]"
              copyText={tbaAddress}
            >
              {maskAddress(tbaAddress)}
            </CopyButton>
          </div>
          <div className="flex gap-4">
            <DepositButton
              tbaAddress={tbaAddress}
              tokenId={tokenId}
            />
            <WithdrawButton tbaAddress={tbaAddress} />
          </div>
          <BeepSettingsPanel
            tbaAddress={tbaAddress}
            tokenId={tokenId}
          />
        </div>
      </div>
      <div className="my-10 md:my-20 max-w-[900px] mx-auto">
        <TbaRecord tbaAddress={tbaAddress} />
      </div>
    </div>
  )
}

export default TBAContainer
