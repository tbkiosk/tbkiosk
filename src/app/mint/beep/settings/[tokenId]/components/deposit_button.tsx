'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'

import CopyButton from '@/components/copy_button'
import RobotSuccess from 'public/beep/robot-success.svg'

import { maskAddress } from '@/utils/address'

const DepositButton = ({ tokenId, tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const showDepositModal = searchParams.get('show-deposit-modal')

  return (
    <>
      <Button
        className="w-[172px] px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
        onClick={() => router.replace(`${location.pathname}?show-deposit-modal=true`)}
      >
        Deposit
      </Button>
      <Modal
        isOpen={showDepositModal === 'true'}
        onClose={() => router.replace(location.pathname)}
        size="2xl"
      >
        <ModalContent className="bg-black text-white">
          {() => (
            <>
              <ModalHeader className="justify-center text-2xl">Deposit USDC to your Beep account</ModalHeader>
              <ModalBody className="px-8 pb-8">
                <div className="h-16 flex justify-center">
                  <RobotSuccess />
                </div>
                <p className="my-2 font-medium text-xl text-center">
                  The wallet address for Beep #{tokenId} is <span className="text-[#a6a9ae]">{maskAddress(tbaAddress)}</span>
                </p>
                <p className="font-medium text-xl text-center">Make sure you deposit USDC on Ethereum network only</p>
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
