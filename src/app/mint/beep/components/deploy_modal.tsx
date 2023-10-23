'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalProps } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Web3Button } from '@thirdweb-dev/react'
import { erc6551RegistryAbi } from '@tokenbound/sdk'
import { match } from 'ts-pattern'
import { toast } from 'react-toastify'

import RobotSuccess from 'public/beep/robot-success.svg'

import { useOwnedBeepTbaDeployedStatus } from '@/hooks/use_owned_beep_tba_deployed_status'
import { useGetTbaAccount } from '@/hooks/use_get_tba_account'

import { maskAddress } from '@/utils/address'

import { chain } from '@/constants/chain'
import { IMPLEMENTATION_ADDRESS, CONTRACT_ADDRESS, REGISTRY_ADDRESS } from '@/constants/beep'

const DeployModal = ({ isOpen, onOpenChange, tokenId }: Pick<ModalProps, 'isOpen' | 'onOpenChange'> & { tokenId: string | null }) => {
  const { nft: lastOwnedNFT, setAccountDeployedStatus } = useOwnedBeepTbaDeployedStatus({ lastOwned: true })
  const tbaAddress = useGetTbaAccount({
    tokenId: tokenId ?? '',
    implementationAddress: IMPLEMENTATION_ADDRESS,
    contractAddress: CONTRACT_ADDRESS,
  })

  const [isDeployed, setIsDeployed] = useState(false)

  const createAccount = async () => {
    try {
      const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to create user account')
    }
  }

  return (
    <Modal
      hideCloseButton={!isDeployed}
      isDismissable={!isDeployed}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader />
            <ModalBody className="px-8 pb-8">
              <div className="flex justify-center">
                <span className="h-24 w-24">
                  <RobotSuccess />
                </span>
              </div>
              {match(isDeployed)
                .with(false, () => (
                  <>
                    <p className="my-4 font-medium text-xl text-center">
                      <p className="mb-2">Congratulations! Your Beep has minted.</p>
                      <p className="mb-2">Now let us deploy your Beep&apos;s wallet!</p>
                    </p>
                    <Web3Button
                      action={async contract => {
                        const tokenID = tokenId ?? lastOwnedNFT
                        await contract.call('createAccount', [
                          IMPLEMENTATION_ADDRESS,
                          chain.chainId,
                          CONTRACT_ADDRESS,
                          tokenID ?? '',
                          0,
                          '0x',
                        ])
                      }}
                      className="!h-[44px] !bg-black !text-white !text-xl !rounded-full !transition-colors hover:!bg-[#1F1F1F] [&>svg>circle]:!stroke-white"
                      contractAbi={erc6551RegistryAbi}
                      contractAddress={REGISTRY_ADDRESS}
                      onError={error => {
                        toast.error((error as unknown as { reason: string })?.reason || 'Failed to deploy')
                      }}
                      onSuccess={() => {
                        setIsDeployed(true)
                        setAccountDeployedStatus('Deployed')
                        createAccount()
                      }}
                      theme="dark"
                    >
                      Deploy Beep&apos;s Wallet
                    </Web3Button>
                  </>
                ))
                .with(true, () => (
                  <>
                    <p className="mt-4 font-medium text-xl text-center">Congrats, Your Beep&apos;s Wallet is live and ready to use!</p>
                    <p className="font-medium text-xl text-center text-[#a6a9ae]">{maskAddress(tbaAddress)}</p>
                    <p className="my-4 font-medium text-xl text-center">Send USDC into your Beep&apos;s wallet to get started.</p>
                    <a
                      className="block"
                      href={`/mint/beep/settings/${tokenId}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Button className="h-[44px] w-full bg-black text-xl text-white rounded-full transition-colors hover:bg-[#1F1F1F]">
                        Set Up Your Beep Now
                      </Button>
                    </a>
                  </>
                ))
                .exhaustive()}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default DeployModal
