'use client'

import { useState } from 'react'
import { useAddress } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { useDisclosure } from '@nextui-org/react'

import PlanModal, { type PlanForm } from './plan_modal'
import { BigNumber } from 'alchemy-sdk'
import GearIcon from 'public/icons/gear.svg'
import Ethereum from 'public/icons/tokens/ethereum.svg'
import Image from 'next/image'

type TbaUser = {
  active: boolean
  lastBridge: BigNumber
  preference: string
  tbaAddress: string
}

const SettingsBoardScroller = ({ tbaUser }: { tbaUser: TbaUser | undefined }) => {
  const address = useAddress()

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  // const onUpdateStatus = async () => {}

  const onSubmit = async ({ depositAmount, gasTolerance, mintAmount }: PlanForm) => {
    toast.success('Investment plan updated')
    onClose()
  }

  return (
    <div className="flex flex-col items-center grow px-8 py-4 bg-[#131313] rounded-[10px] shadow-md">
      <PlanModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        depositAmount={'0.125'}
        mintAmount={1}
        gasTolerance={2}
      />
      {/* <div className="w-full flex items-center gap-4 mb-2">Your Gas Tolerance will appear here.</div> */}
      <div className="w-full flex justify-between items-center gap-4 mb-2">
        <div>
          <div className="text-lg">{tbaUser?.preference}</div>
          <div className="text-xs">$TODO</div>
        </div>
        <div className="flex text-xs">
          <div>pencil</div>
          <div>Edit</div>
        </div>
      </div>
      <hr className="w-full mb-6 border-[#a6a9ae]" />
      <div className="text-lg">
        Bridge from Ethereum to Scroll when gas fee with <span className="text-blue-600 text-bold">Medium</span> tolernance ({'$30-40'})
      </div>
      <div className="w-full flex justify-between">
        <div />
        <div>
          <p className="text-xs">Status</p>
          <Image
            src="/public/icons/tokens/ethereum-circle.svg"
            alt="Ethereum"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsBoardScroller
