'use client'

import { useEffect, useState } from 'react'
import { ThirdwebSDK, useAddress, useContract, useOwnedNFTs, useSigner } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { useDisclosure } from '@nextui-org/react'

import PenIcon from 'public/icons/pen.svg'

import PlanModal, { type PlanForm } from './plan_modal'
import { BigNumber } from 'alchemy-sdk'
import Image from 'next/image'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { env } from 'env.mjs'
import { ThirdWebError } from '@/types'
import { gasInfoMap } from '@/constants/scroller'
import { formatEther } from 'viem'

type TbaUser = {
  active: boolean
  lastBridge: BigNumber
  preference: string
  tbaAddress: string
}

const SettingsBoardScroller = ({ tbaUser, tokenId }: { tbaUser: TbaUser | undefined; tokenId: string }) => {
  const [tbaBalance, setTbaBalance] = useState<string>('')
  const [tba, setTba] = useState<any>({})

  const signer = useSigner()
  const address = useAddress()
  const { contract, isLoading, error } = useContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)

  // const { refetch } = useOwnedNFTs(contract, address)
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  useEffect(() => {
    const getTba = async () => {
      if (!contract || !address) return
      const [_tba, balance] = await contract.call('getTBA', [tokenId])
      setTba(_tba)
      setTbaBalance(formatEther(balance))
    }
    getTba()
  }, [isOpen])

  const onSubmit = async ({ gasTolerance }: PlanForm) => {
    if (!signer) {
      toast.error('Signer not defined')
      return
    }

    if (!contract) {
      toast.error('Failed to collect contract information')
      return
    }

    try {
      const sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN_ID_SCROLLER, {
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      })
      const nftContract = await sdk.getContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)

      const updateGasArgs = [tokenId, gasInfoMap[gasTolerance].arg]

      await nftContract.call('updateTBA', updateGasArgs)

      toast.success(`Gas Tolerance updated to ${gasInfoMap[gasTolerance].label}`)
      onOpenChange()
    } catch (error) {
      toast.error((error as ThirdWebError)?.reason || (error as Error)?.message || 'Failed to udpate preference')
    }
  }

  return (
    <div className="flex flex-col items-center grow px-8 py-4 bg-[#2B2B2B] rounded-[10px] shadow-md">
      <PlanModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        gasTolerance={0} // TODO
      />
      <div className="w-full flex justify-between mb-2">
        <div>
          {/* TODO: USE ENUM for mapping + validation */}
          <div className="text-xl font-bold">{tbaUser ? gasInfoMap[+tbaUser.preference].label : ''}</div>
          <div className="text-xs opacity-50">$123-456</div>
        </div>
        <div
          className="flex justify-center items-center shrink-0 font-bold cursor-pointer"
          onClick={onOpen}
        >
          <div className="h-4 w-4 text-[#caff47]">
            <PenIcon />
          </div>
          Edit
        </div>
      </div>
      <hr className="w-full mb-6 opacity-20" />
      <div className="text-lg mb-8 font-bold">
        Scoller will bridge from Ethereum to Scroll when gas is{' '}
        <span className="text-blue-600 font-bold">{tbaUser ? gasInfoMap[+tbaUser.preference].label : ''}</span> {/* TODO */}
        (typically {'$30-40'})
      </div>
      <div className="w-full flex justify-between">
        <div className="text-sm flex items-end opacity-50">Check on Scroll</div>
        <div>
          <p className="text-xs opacity-50 py-2">Status</p>
          <div className="w-16 pb-2">
            <Image
              src={parseFloat(tbaBalance) > 0 && tbaUser?.preference ? '/scroller/on.png' : '/scroller/off.png'}
              alt="status"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsBoardScroller