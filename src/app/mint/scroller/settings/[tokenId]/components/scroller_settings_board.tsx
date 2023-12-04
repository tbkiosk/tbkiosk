'use client'

import { ThirdwebSDK, useAddress, useContract, useSigner } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { useDisclosure } from '@nextui-org/react'

import PenIcon from 'public/icons/pen.svg'

import PlanModal, { type PlanForm } from './plan_modal'
import { BigNumber } from 'alchemy-sdk'
import Image from 'next/image'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { env } from 'env.mjs'
import { TbaUser, ThirdWebError } from '@/types'
import { gasInfoMap } from '@/constants/scroller/scroller'

const SettingsBoardScroller = ({
  tba,
  tokenId,
  onOpenChange,
}: {
  tba: TbaUser
  tokenId: string
  onOpenChange: (isOpen: boolean) => void
}) => {
  const signer = useSigner()
  const address = useAddress()
  const { contract } = useContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async ({ gasTolerance }: PlanForm) => {
    if (!signer) {
      toast.error('Signer not defined')
      return
    }

    if (!contract) {
      toast.error('Failed to collect contract information')
      return
    }

    if (!gasTolerance) {
      toast.error('Please select gas tolerance')
      return
    }

    try {
      const sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN_ID_SCROLLER, {
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      })
      const nftContract = await sdk.getContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)

      const updateGasArgs = [tokenId, BigNumber.from(gasTolerance)]

      await nftContract.call('updateTBA', updateGasArgs)

      toast.success(`Gas Tolerance updated to ${gasInfoMap[gasTolerance].label}`)
      onOpenChange(isOpen)
    } catch (error) {
      toast.error((error as ThirdWebError)?.reason || (error as Error)?.message || 'Failed to update gasPref')
    }
  }

  return (
    <div className="flex flex-col items-center grow px-8 py-4 bg-[#2B2B2B] rounded-[10px] shadow-md">
      <PlanModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        tba={tba}
        gasTolerance={tba.gasPref} // TODO
      />
      <div className="w-full flex justify-between mb-2">
        <div>
          <div className="text-xl font-bold">{gasInfoMap[tba.gasPref].label}</div>

          <div className="text-xs opacity-50">
            Expected ${gasInfoMap[+tba.gasPref].price.from}-{gasInfoMap[+tba.gasPref].price.to}
          </div>
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
      {tba.balance > 0 ? (
        <div className="text-lg mb-8 font-bold">
          <p>
            Scroller will bridge from Ethereum to Scroll when gas is
            <span className="text-blue-600 font-bold"> {gasInfoMap[+tba.gasPref].label} </span>
            (typically {`less than $${gasInfoMap[+tba.gasPref].price.to}`})
          </p>
        </div>
      ) : (
        <div className="text-lg mb-8">
          <p>
            Simply deposit ETH and your Scroller Pass will automagically bridge according to your gas tolerance. Click Edit to update your
            tolerance.
          </p>
        </div>
      )}
      <div className="w-full flex justify-between">
        <div className="text-sm flex items-end opacity-50">
          <a
            href={`https://sepolia.scrollscan.com/address/${address}#internaltx`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check on Scroll
          </a>
        </div>
        <div>
          <p className="text-xs opacity-50 py-2">Status</p>
          <div className="w-16 pb-2">
            <Image
              src={tba.balance > 0 && tba.gasPref ? '/scroller/on.png' : '/scroller/off.png'}
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
