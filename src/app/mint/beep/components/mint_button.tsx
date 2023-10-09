'use client'

import { useConnectionStatus, Web3Button } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { match } from 'ts-pattern'

import ConnectWalletButton from '@/components/connect_wallet_button'

import { useOwnedBeepTbaDeployedStatus } from '@/hooks/use_owned_beep_tba_deployed_status'

import { CONTRACT_ADDRESS } from '@/constants/beep'

const MintButton = () => {
  const connectionStatus = useConnectionStatus()
  const { status } = useOwnedBeepTbaDeployedStatus({ lastOwned: true })

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
      className="!h-10 !w-full !bg-black !rounded-lg"
      contractAddress={CONTRACT_ADDRESS}
      onError={error => {
        toast.error((error as unknown as { reason: string })?.reason || 'Failed to claim NFT')
      }}
      // onSuccess={data => {
      //   const tokenId = data[0].id.toNumber()
      //   onSuccess(tokenId.toString())
      // }}
      theme="light"
    >
      Mint now
    </Web3Button>
  )

  return (
    <div className="mt-4">
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
