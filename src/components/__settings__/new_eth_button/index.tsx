import { useState } from 'react'
import { getCsrfToken, signIn } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { toast } from 'react-toastify'

import { Button } from '@/components'

const NewETHButton = () => {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()
  const [connecting, setConnecting] = useState(false)

  const handleConnectEth = async () => {
    setConnecting(true)

    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to Morphis Airdawg',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: true,
        signature,
        callbackUrl: '/settings',
      })
    } catch (error) {
      toast((error as Error)?.message || 'Failed to sign in')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Button
      className="!h-8 !w-auto"
      loading={connecting}
      onClick={() => (isConnected ? handleConnectEth() : openConnectModal?.())}
      variant="outlined"
    >
      Connect another ETH address
    </Button>
  )
}

export default NewETHButton
