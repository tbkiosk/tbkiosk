'use client'

import { useAddress, useChainId, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { Spinner, useDisclosure } from '@nextui-org/react'

import ScrollerIframe from '../../components/scroller_iframe'
import CopyButton from '@/components/copy_button'
import DepositButton from './deposit_button'
import ScrollerSettingsPanel from './scroller_settings_panel'
import WithdrawButton from './withdraw_button'

import { env } from 'env.mjs'

import { maskAddress } from '@/utils/address'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import TbaRecord from './tba_record'
import useTbaScrollerUser from '@/hooks/useTbaScrollerUser'

const TBAContainer = ({ tokenId }: { tokenId: string }) => {
  const address = useAddress()
  const chainId = useChainId()
  const { contract } = useContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { tba, isLoading: isLoadingTba, error: errorTba } = useTbaScrollerUser(+tokenId, isOpen)
  const { data, isLoading: isLoadingNft, error: errorNft } = useOwnedNFTs(contract, address)

  const handleModalChange = (isOpen: boolean) => {
    if (isOpen) {
      onOpen()
    } else {
      onClose()
    }
  }

  if (!chainId || +chainId !== +env.NEXT_PUBLIC_CHAIN_ID_SCROLLER) {
    return null
  }

  if (errorNft) {
    return <p className="text-center">{(errorNft as Error)?.message || 'Failed to load NFT'}</p>
  }

  if (errorTba) {
    return <p className="text-center">{(errorTba as Error)?.message || 'Failed to load TBA'}</p>
  }

  if (isLoadingNft || isLoadingTba) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  if (!data) return <p className="text-center">No NFTs found</p>

  if (!data.find(_data => _data.metadata.id === tokenId)) return <p className="text-center">This TBA is not owned by you!</p>

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 pt-8 md:pt-16">
        <div className="max-h-full w-full flex justify-center shrink-0 md:justify-end md:w-[40%]">
          <div className="max-h-full flex justify-center items-center w-[60%] md:w-full h-full">
            <ScrollerIframe
              tba={tba}
              isLoading={isLoadingTba}
              tokenId={tokenId}
            />
          </div>
        </div>

        <div className="w-full max-w-[534px]">
          <h1 className="mb-4 font-bold text-4xl">Set up your Scroller Pass!</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-xl">Scroller Pass #{tokenId}</span>
            <CopyButton
              className="px-4 py-1 rounded-full font-normal text-sm text-[#a6a9ae] hover:border-[#666666]"
              copyText={tba.address}
            >
              {maskAddress(tba.address)}
            </CopyButton>
          </div>
          <div className="flex gap-4 mb-8">
            <DepositButton
              tba={tba}
              isLoading={isLoadingTba}
              onOpenChange={handleModalChange}
            />
            <WithdrawButton
              tba={tba}
              tokenId={tokenId}
              onOpenChange={handleModalChange}
            />
          </div>
          <ScrollerSettingsPanel
            tba={tba}
            tokenId={tokenId}
            isLoading={isLoadingTba}
            onOpenChange={handleModalChange}
          />
        </div>
      </div>
      <div className="my-10 md:my-20 max-w-[900px] mx-auto">
        <TbaRecord tba={tba} />
      </div>
    </div>
  )
}

export default TBAContainer
