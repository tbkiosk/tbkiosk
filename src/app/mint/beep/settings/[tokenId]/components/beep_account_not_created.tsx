'use client'

import { Button, useDisclosure } from '@nextui-org/react'

import PlanModal from './plan_modal'
import RobotSuccess from 'public/beep/robot-success.svg'

const BeepAccountNotCreated = ({ refetch, tbaAddress }: { refetch: () => Promise<unknown>; tbaAddress: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <div className="min-h-[240px] flex flex-col justify-center items-center gap-4 bg-[#131313] rounded-[10px]">
      <PlanModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refetch={refetch}
        tbaAddress={tbaAddress}
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
