import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components'

import { request } from '@/utils/request'

import type { Account } from '@prisma/client'
import type { AccountUpdateReq } from '@/pages/api/user/account'

type NewETHButtonProps = {
  onRefresh: () => void
}

const NewETHButton = ({ onRefresh }: NewETHButtonProps) => {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const { isLoading, mutate } = useMutation({
    mutationFn: async (args: AccountUpdateReq) => {
      const { error } = await request<Account>({
        url: '/api/user/account',
        method: 'POST',
        data: {
          ...args,
        },
      })

      if (error) {
        throw new Error(error as string)
      }
    },
    onSuccess: () => {
      toast.success(`Successfully connected ${address}`)
      onRefresh()
    },
    onError: error => {
      toast.error((error as Error)?.message || 'Failed to connect new Ethereum address')
    },
  })

  const handleConnectEth = async () => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }

    if (chain?.name !== 'Ethereum') {
      openChainModal?.()
      return
    }

    if (!chain?.name || !address) {
      throw new Error('Invalid chain or address')
    }

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

      mutate({
        chain: chain.name,
        address,
        signature,
      })
    } catch (error) {
      toast((error as Error)?.message || 'Failed to sign in')
    }
  }

  return (
    <Button
      className="!h-8 !w-auto"
      loading={isLoading}
      onClick={() => handleConnectEth()}
      variant="outlined"
    >
      Connect another ETH address
    </Button>
  )
}

export default NewETHButton
