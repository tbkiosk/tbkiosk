'use client'

import { useAddress, useChainId, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'

import BeepIframe from '../../components/beep_iframe'
import CopyButton from '@/components/copy_button'
import DepositButton from './deposit_button'
import WithdrawButton from './withdraw_button'
import BeepSettingsPanel from './beep_settings_panel'
import TbaRecord from './tba_record'

import useTbaAddress from '@/hooks/useTbaAddress'

import { maskAddress } from '@/utils/address'

import { env } from 'env.mjs'

const TBAContainer = ({ tokenId }: { tokenId: string }) => {
  const address = useAddress()
  const chainId = useChainId()
  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS : null)
  const { data, isLoading, error } = useOwnedNFTs(contract, address)
  const tbaAddress = useTbaAddress(tokenId)

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
        <div className="w-full md:w-[480px] flex justify-center md:justify-start shrink-0">
          <div className="max-h-full aspect-square overflow-hidden">
            <BeepIframe tokenId={tokenId} />
          </div>
        </div>
        <div className="w-full max-w-[480px]">
          <h1 className="mb-4 font-bold text-4xl">Set up your Beep</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-xl">Beep #{tokenId}</span>
            <CopyButton
              className="px-4 py-1 border-none rounded-full font-normal text-sm text-[#a6a9ae] hover:border-[#666666]"
              copyText={tbaAddress}
            >
              {maskAddress(tbaAddress)}
            </CopyButton>
          </div>
          <div className="flex gap-4 mb-8">
            <DepositButton
              tbaAddress={tbaAddress}
              tokenId={tokenId}
            />
            <WithdrawButton tbaAddress={tbaAddress} />
          </div>
          <BeepSettingsPanel tbaAddress={tbaAddress} />
        </div>
      </div>
      <div className="my-10 md:my-20 max-w-4xl mx-auto">
        <TbaRecord tbaAddress={tbaAddress} />
      </div>
    </div>
  )
}

export default TBAContainer
