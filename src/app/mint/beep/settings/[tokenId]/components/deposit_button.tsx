'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, ModalFooter } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'

import CopyButton from '@/components/copy_button'
import RobotSuccess from 'public/beep/robot-success.svg'

import { maskAddress } from '@/utils/address'

const DepositButton = ({ tokenId, tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button
        className="w-[172px] px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
        onClick={onOpen}
      >
        Deposit
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
      >
        <ModalContent className="bg-black text-white">
          {() => (
            <>
              <ModalHeader className="justify-center text-2xl">Deposit to your Beep account</ModalHeader>
              <ModalBody className="px-8 pb-8">
                <div className="flex justify-center">
                  <RobotSuccess />
                </div>
                <p className="my-2 font-medium text-xl text-center">
                  The wallet address for Beep #{tokenId} is <span className="text-[#a6a9ae]">{maskAddress(tbaAddress)}</span>
                </p>
                <p className="font-medium text-xl text-center">Make sure you deposit USDC on Polygon network only</p>
              </ModalBody>
              <ModalFooter className="justify-center mb-4">
                <CopyButton
                  className="px-8 py-1 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1] hover:text-black"
                  copyText={tbaAddress}
                >
                  Copy Beep address
                </CopyButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DepositButton
