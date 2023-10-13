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
        <ConnectWalletButton className="!w-full" />
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
