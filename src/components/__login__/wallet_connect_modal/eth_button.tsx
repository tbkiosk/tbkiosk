import Image from 'next/image'
import { toast } from 'react-toastify'
import { getCsrfToken, signIn } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { Button } from '@/components'

const EthButton = () => {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()

  const onConnect = async () => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }

    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to Morphis Airdawg',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      signIn('Ethereum', {
        message: JSON.stringify(message),
        redirect: true,
        signature,
        callbackUrl: '/discover',
      })
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to sign in')
    }
  }

  return (
    <Button
      className="!w-[304px] flex items-center gap-5 mb-2 pl-[52px] !border-[#e0e0e9] font-normal !text-lg"
      onClick={() => onConnect()}
      variant="outlined"
    >
      <Image
        alt="eth"
        height={24}
        src="/icons/chains/eth.svg"
        width={24}
      />
      Ethereum Wallet
    </Button>
  )
}

export default EthButton
