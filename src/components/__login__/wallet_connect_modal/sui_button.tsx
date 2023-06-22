import { useState } from 'react'
import Image from 'next/image'
import { getCsrfToken, signIn } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'

import { Button } from '@/components'

import { ellipsisMiddle } from '@/utils/address'

const SuiButton = () => {
  const { connected, address, disconnect, signMessage } = useWallet()
  const [showModal, setShowModal] = useState(false)

  const onConnect = async () => {
    if (!connected) {
      setShowModal(true)
      return
    }

    try {
      const message = JSON.stringify({
        domain: window.location.host,
        address,
        statement: 'Sign in with Sui to Morphis Airdawg',
        uri: window.location.origin,
        nonce: await getCsrfToken(),
      })
      const msgBytes = new TextEncoder().encode(message)
      const signature = await signMessage({
        message: msgBytes,
      })

      signIn('Sui', {
        message,
        redirect: true,
        signature: JSON.stringify(signature),
        callbackUrl: '/discover',
      })
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to sign in')
    }
  }

  return (
    <ConnectModal
      onConnectSuccess={() => setShowModal(false)}
      open={showModal}
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
