'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalProps } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Web3Button } from '@thirdweb-dev/react'
import { erc6551RegistryAbi } from '@tokenbound/sdk'
import { match } from 'ts-pattern'
import { toast } from 'react-toastify'

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
                <svg
                  width="118"
                  height="117"
                  viewBox="0 0 118 117"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M51 4.6188C55.9504 1.76068 62.0496 1.76068 67 4.6188L101.662 24.6312C106.613 27.4893 109.662 32.7714 109.662 38.4876V78.5124C109.662 84.2286 106.613 89.5107 101.662 92.3688L67 112.381C62.0496 115.239 55.9504 115.239 51 112.381L16.3375 92.3688C11.3871 89.5107 8.33751 84.2286 8.33751 78.5124V38.4876C8.33751 32.7714 11.3871 27.4893 16.3375 24.6312L51 4.6188Z"
                    fill="#E4FDF3"
                  />
                  <path
                    d="M53.5 29H54.5V38H53.5V29Z"
                    fill="#6A868E"
                  />
                  <path
                    d="M53.5 82H32.7876C30.4225 82 28.5 80.1636 28.5 77.8889V41.1111C28.5 38.8434 30.4153 37 32.7876 37H53.5V82Z"
                    fill="#57A5AA"
                  />
                  <path
                    d="M53.5 37H74.2124C76.5775 37 78.5 38.8365 78.5 41.1111V77.8889C78.5 80.1566 76.5847 82 74.2124 82H53.5V37Z"
                    fill="#368F9C"
                  />
                  <path
                    d="M58.5 52.5C58.5 53.4283 58.9214 54.3185 59.6716 54.9749C60.4217 55.6313 61.4391 56 62.5 56C63.5609 56 64.5783 55.6313 65.3284 54.9749C66.0786 54.3185 66.5 53.4283 66.5 52.5C66.5 51.5717 66.0786 50.6815 65.3284 50.0251C64.5783 49.3687 63.5609 49 62.5 49C61.4391 49 60.4217 49.3687 59.6716 50.0251C58.9214 50.6815 58.5 51.5717 58.5 52.5Z"
                    fill="white"
                  />
                  <path
                    d="M40.5 52.5C40.5 53.4283 40.9214 54.3185 41.6716 54.9749C42.4217 55.6313 43.4391 56 44.5 56C45.5609 56 46.5783 55.6313 47.3284 54.9749C48.0786 54.3185 48.5 53.4283 48.5 52.5C48.5 51.5717 48.0786 50.6815 47.3284 50.0251C46.5783 49.3687 45.5609 49 44.5 49C43.4391 49 42.4217 49.3687 41.6716 50.0251C40.9214 50.6815 40.5 51.5717 40.5 52.5Z"
                    fill="white"
                  />
                  <path
                    d="M50.5 28.5C50.5 29.4283 50.8687 30.3185 51.5251 30.9749C52.1815 31.6313 53.0717 32 54 32C54.9283 32 55.8185 31.6313 56.4749 30.9749C57.1313 30.3185 57.5 29.4283 57.5 28.5C57.5 27.5717 57.1313 26.6815 56.4749 26.0251C55.8185 25.3687 54.9283 25 54 25C53.0717 25 52.1815 25.3687 51.5251 26.0251C50.8687 26.6815 50.5 27.5717 50.5 28.5Z"
                    fill="#6A868E"
                  />
                  <path
                    d="M28.3877 64L24.5 62.1161V53.0916L28.3877 51.0693V64ZM77.6123 51L81.5 52.8908V61.9084L77.6123 63.9307V51Z"
                    fill="#506F78"
                  />
                  <g clipPath="url(#clip0_4001_23186)">
                    <path
                      d="M78 62C82.1109 62 86.0533 63.633 88.9602 66.5398C91.867 69.4467 93.5 73.3891 93.5 77.5C93.5 81.6109 91.867 85.5533 88.9602 88.4602C86.0533 91.367 82.1109 93 78 93C73.8891 93 69.9467 91.367 67.0398 88.4602C64.133 85.5533 62.5 81.6109 62.5 77.5C62.5 73.3891 64.133 69.4467 67.0398 66.5398C69.9467 63.633 73.8891 62 78 62Z"
                      fill="white"
                    />
                    <path
                      opacity="0.9"
                      d="M77.9996 65.0996C81.2883 65.0996 84.4423 66.406 86.7677 68.7315C89.0932 71.0569 90.3996 74.2109 90.3996 77.4996C90.3996 80.7883 89.0932 83.9423 86.7677 86.2677C84.4423 88.5932 81.2883 89.8996 77.9996 89.8996C74.7109 89.8996 71.5569 88.5932 69.2315 86.2677C66.906 83.9423 65.5996 80.7883 65.5996 77.4996C65.5996 74.2109 66.906 71.0569 69.2315 68.7315C71.5569 66.406 74.7109 65.0996 77.9996 65.0996Z"
                      fill="#07EA7D"
                    />
                    <path
                      d="M85.492 74.6351L76.9456 82.6053L76.6928 82.8245L76.4399 82.6053L71.1445 77.677L72.8711 76.0697L76.6928 79.6231L83.7943 73.0078L85.492 74.6351Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4001_23186">
                      <rect
                        width="31"
                        height="31"
                        fill="white"
                        transform="translate(62.5 62)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              {match(isDeployed)
                .with(false, () => (
                  <>
                    <p className="my-4 font-medium text-xl text-center">
                      Great! Your Beep is already minted. Now deploy your token bound account to start using beep!
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
                      Deploy Token Bound Account
                    </Web3Button>
                  </>
                ))
                .with(true, () => (
                  <>
                    <p className="mt-4 font-medium text-xl text-center">
                      Congrats, Your Beep Bot is ready! Your Token Bound Account(TBA) is
                    </p>
                    <p className="font-medium text-xl text-center text-[#a6a9ae]">{maskAddress(tbaAddress)}</p>
                    <p className="my-4 font-medium text-xl text-center">
                      Deposit USDC to your TBA and set up your intervals to get started.
                    </p>
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
