'use client'

import { useState } from 'react'
import { useConnectionStatus, Web3Button } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { match } from 'ts-pattern'
import { useDisclosure } from '@nextui-org/modal'

import ConnectWalletButton from '@/components/connect_wallet_button'
import DeployModal from './deploy_modal'

import { useOwnedBeepTbaDeployedStatus } from '@/hooks/use_owned_beep_tba_deployed_status'

import { CONTRACT_ADDRESS } from '@/constants/beep'

const MintButton = () => {
  const connectionStatus = useConnectionStatus()
  const { status } = useOwnedBeepTbaDeployedStatus({ lastOwned: true })

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [tokenId, setTokenId] = useState<string | null>(null)

  if (connectionStatus !== 'connected') {
    return (
      <div className="mt-4">
        <ConnectWalletButton className="!h-12 !w-full !text-xl !rounded-full" />
      </div>
    )
  }

  const renderClaimNFTButton = () => (
    <Web3Button
      action={contract => contract.erc721.claim(1)}
      className="!h-12 !w-full !bg-black !text-xl !rounded-full !transition-colors hover:!bg-[#1F1F1F] [&>svg>circle]:!stroke-white"
      contractAddress={CONTRACT_ADDRESS}
      onError={error => {
        toast.error((error as unknown as { reason: string })?.reason || 'Failed to claim NFT')
      }}
      onSuccess={data => {
        const tokenId = data[0].id.toNumber()
        setTokenId(tokenId.toString())
        onOpen()
      }}
      theme="light"
    >
      <span className="block mr-4">
        <svg
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.849 5.87253C14.5026 5.68148 14.0573 5.68148 13.6615 5.87253L10.8906 7.44865L9.01042 8.45163L6.28906 10.0278C5.94271 10.2188 5.4974 10.2188 5.10156 10.0278L2.97396 8.78596C2.6276 8.59492 2.38021 8.21283 2.38021 7.78298V5.39492C2.38021 5.01283 2.57812 4.63074 2.97396 4.39193L5.10156 3.1979C5.44792 3.00686 5.89323 3.00686 6.28906 3.1979L8.41667 4.43969C8.76302 4.63074 9.01042 5.01283 9.01042 5.44268V7.0188L10.8906 5.96805V4.34417C10.8906 3.96208 10.6927 3.57999 10.2969 3.34118L6.33854 1.09641C5.99219 0.905364 5.54687 0.905364 5.15104 1.09641L1.09375 3.38895C0.697917 3.57999 0.5 3.96208 0.5 4.34417V8.83372C0.5 9.21581 0.697917 9.5979 1.09375 9.83671L5.10156 12.0815C5.44792 12.2725 5.89323 12.2725 6.28906 12.0815L9.01042 10.5531L10.8906 9.50238L13.612 7.97402C13.9583 7.78298 14.4036 7.78298 14.7995 7.97402L16.9271 9.16805C17.2734 9.3591 17.5208 9.74119 17.5208 10.171V12.5591C17.5208 12.9412 17.3229 13.3233 16.9271 13.5621L14.849 14.7561C14.5026 14.9472 14.0573 14.9472 13.6615 14.7561L11.5339 13.5621C11.1875 13.371 10.9401 12.9889 10.9401 12.5591V11.0307L9.0599 12.0815V13.6576C9.0599 14.0397 9.25781 14.4218 9.65365 14.6606L13.6615 16.9054C14.0078 17.0964 14.4531 17.0964 14.849 16.9054L18.8568 14.6606C19.2031 14.4695 19.4505 14.0875 19.4505 13.6576V9.12029C19.4505 8.7382 19.2526 8.35611 18.8568 8.1173L14.849 5.87253Z"
            fill="white"
          />
        </svg>
      </span>
      Mint now
    </Web3Button>
  )

  return (
    <div className="mt-4">
      <DeployModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        tokenId={tokenId}
      />
      {match(status)
        .with('Loading', renderClaimNFTButton)
        .with('Deployed', renderClaimNFTButton)
        .with('NotDeployed', renderClaimNFTButton)
        .with('Error', () => <p className="text-red-500">Something Went wrong while trying to fetch data</p>)
        .with('NoToken', renderClaimNFTButton)
        .exhaustive()}
    </div>
  )
}

export default MintButton
