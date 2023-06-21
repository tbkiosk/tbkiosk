import { useState } from 'react'
import Image from 'next/image'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'

import { Button } from '@/components'

import { ellipsisMiddle } from '@/utils/address'

const SuiButton = () => {
  const { connected, address, disconnect } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const onConnect = () => {
    if (!connected) {
      setShowModal(true)
      return
    }
  }

  return (
    <ConnectModal
      open={showModal}
      onOpenChange={open => setShowModal(open)}
      onConnectSuccess={() => setShowModal(false)}
    >
      <Button
        className="!w-[304px] flex items-center gap-5 mb-2 pl-[52px] !border-[#e0e0e9] font-normal !text-lg"
        onClick={() => onConnect()}
        variant="outlined"
      >
        <Image
          alt="sui"
          height={24}
          src="/icons/chains/sui.svg"
          width={24}
        />
        {connected ? ellipsisMiddle(address || '') : 'Sui Wallet'}
        {connected && (
          <i
            className="fa-regular fa-circle-xmark cursor-pointer transition hover:scale-[1.1] hover:opacity-70"
            onClick={e => {
              e.stopPropagation()
              disconnect()
            }}
          />
        )}
      </Button>
    </ConnectModal>
  )
}

export default SuiButton
