'use client'

import { Button, useDisclosure } from '@nextui-org/react'
import { useAddress } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'

import PlanModal, { type PlanForm } from './plan_modal'
import RobotSuccess from 'public/beep/robot-success.svg'

const BeepAccountNotCreated = ({ refetch, tbaAddress }: { refetch: () => Promise<unknown>; tbaAddress: string }) => {
  const address = useAddress()

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const onSubmit = async ({ amount, frequency, tokenAddressFrom, tokenAddressTo, endDate }: PlanForm) => {
    const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerAddress: address,
        frequency,
        amount,
        tokenAddressFrom,
        tokenAddressTo,
        endDate,
      }),
    })

    if (!res.ok) {
      toast.error(res.statusText || 'Failed to create plan')
      return
    }

    toast.success('Investment plan created')
    await refetch()
    onClose()
  }

  return (
    <div className="min-h-[240px] flex flex-col justify-center items-center gap-4 bg-[#2b2b2b] rounded-[10px]">
      <PlanModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
      <div className="h-16 flex justify-center">
        <RobotSuccess />
      </div>
      <div className="text-lg tracking-wider">Your Beep does not have any plan yet</div>
      <Button
        className="px-8 font-bold text-black bg-white rounded-full tracking-wider"
        onClick={onOpen}
      >
        Create a plan now
      </Button>
    </div>
  )
}

export default BeepAccountNotCreated
