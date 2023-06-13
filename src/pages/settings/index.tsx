import Head from 'next/head'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { toast } from 'react-toastify'

import Layout from '@/layouts'
import { Loading } from '@/components'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'

const Settings = () => {
  useSessionGuard()
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signMessageAsync } = useSignMessage()

  const onSign = async () => {
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
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to sign message')
    }
  }

  return (
    <>
      <Head>
        <title>Morphis Airdawg - Settings</title>
        <meta
          name="description"
          content="Morphis Airdawg settings"
        />
      </Head>
      <Layout>
        <div className="min-h-[540px] flex flex-col">
          <Loading isLoading={false}>
            <p onClick={onSign}>123</p>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Settings
