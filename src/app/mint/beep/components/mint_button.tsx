'use client'

import { useConnectionStatus } from '@thirdweb-dev/react'
import { match } from 'ts-pattern'
import { useDisclosure, Button } from '@nextui-org/react'

import ConnectWalletButton from '@/components/connect_wallet_button'
import DeployModal from './deploy_modal'

import { env } from 'env.mjs'

import Ethereum from 'public/icons/tokens/ethereum.svg'
import Polygon from 'public/icons/tokens/polygon.svg'

const MintButton = () => {
  const connectionStatus = useConnectionStatus()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  if (connectionStatus !== 'connected') {
    return (
      <div className="mt-4">
        <ConnectWalletButton className="!h-12 !w-full !text-xl !rounded-full" />
      </div>
    )
  }

  return (
    <div className="mt-4">
      <DeployModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <Button
        className="h-12 w-full text-xl text-white bg-black rounded-full hover:bg-[#0f0f0f]"
        disableRipple
        onClick={onOpen}
        startContent={
          <div className="h-6 w-6 block text-white">
            {match(env.NEXT_PUBLIC_CHAIN_ID)
              .with('1', () => <Ethereum />)
              .with('5', () => <Ethereum />)
              .with('137', () => <Polygon />)
              .exhaustive()}
          </div>
        }
      >
        Build your Beep & mint
      </Button>
    </div>
  )
}

export default MintButton
