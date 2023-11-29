'use client'

import { useState, useEffect } from 'react'
import { useAddress, useChainId, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'

import ScrollerIframe from '../../components/scroller_iframe'
import CopyButton from '@/components/copy_button'
import DepositButton from './deposit_button'
import ScrollerSettingsPanel from './scroller_settings_panel'
import WithdrawButton from './withdraw_button'

import { env } from 'env.mjs'

import { maskAddress } from '@/utils/address'
import { abi } from '@/utils/scrollerNft_abiEnumerable'

const TBAContainer = ({ tokenId }: { tokenId: string }) => {
  const [tbaAddress, setTbaAddress] = useState<string>('loading...')
  const address = useAddress()
  const chainId = useChainId()
  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS : null, abi)
  const { data, isLoading, error } = useOwnedNFTs(contract, address)

  useEffect(() => {
    const getTbaAddress = async () => {
      if (!contract || !address) return
      const response = await contract.call('getTBA', [tokenId])
      setTbaAddress(response[0][0])
    }

    getTbaAddress()
  }, [tokenId, contract, address])

  if (!chainId || +chainId !== +env.NEXT_PUBLIC_CHAIN_ID_SCROLLER) {
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

  if (!data.find(_data => _data.metadata.id === tokenId)) return <p className="text-center">This TBA is not owned by you!</p>

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 pt-8 md:pt-16">
        <div className="max-h-full w-full flex justify-center shrink-0 md:justify-end md:w-[40%]">
          <div className="max-h-full flex justify-center items-center w-[60%] md:w-full h-full">
            <ScrollerIframe tokenId={tokenId} />
          </div>
        </div>

        <div className="w-full max-w-[534px]">
          <h1 className="mb-4 font-bold text-4xl">Set up your Scroller Pass!</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-xl">Scroller Pass #{tokenId}</span>
            <CopyButton
              className="px-4 py-1 border border-[#a6a9ae] rounded-full font-normal text-sm text-[#a6a9ae] hover:border-[#666666]"
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
            <WithdrawButton
              tbaAddress={tbaAddress}
              tokenId={tokenId}
            />
          </div>
          <ScrollerSettingsPanel
            tbaAddress={tbaAddress}
            tokenId={tokenId}
          />
        </div>
      </div>
      {/* <div className="my-10 md:my-20 max-w-[900px] mx-auto">
        <TbaRecord tbaAddress={tbaAddress} />
      </div> */}
    </div>
  )
}

export default TBAContainer