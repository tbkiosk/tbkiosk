import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useSession, getCsrfToken, signIn } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'
import { Flex, Modal, Title, Text, Tooltip, Divider, useMantineColorScheme, rem, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import cx from 'classix'

import { ellipsisMiddle } from '@/utils/address'

import Logo from '@/assets/icons/logo'
import WalletIcon from '@/assets/icons/wallet'

const Login = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    if (session) {
      router.push('/discover')
    }
  }, [session, router])

  const showSocialsLogin = searchParams.get('socials')

  return (
    <>
      <Head>
        <title>Morphis Airdawg - Login</title>
        <meta
          name="description"
          content="Morphis Airdawg login"
        />
      </Head>
      <main
        className={cx(`h-[100vh] overflow-hidden bg-[url('/images/login/bg_overlay.jpg')] bg-cover`, colorScheme === 'dark' && 'invert')}
      >
        <Modal
          centered
          closeOnClickOutside={false}
          onClose={() => null}
          opened
          radius="lg"
          withCloseButton={false}
        >
          <Flex
            align="center"
            direction="column"
            gap={rem(16)}
          >
            <Logo />
            <Title
              fw={500}
              order={3}
            >
              Find web3 perks with AirDawg
            </Title>
            <Image
              alt=""
              height={156}
              src="/images/login/artwork_4.png"
              width={274}
            />
            {showSocialsLogin && (
              <>
                <Button
                  classNames={{
                    inner: 'justify-start',
                  }}
                  color="gray"
                  fw={400}
                  leftIcon={<i className="fa-brands fa-twitter text-2xl text-[#1D9BF0]" />}
                  onClick={() => signIn('twitter', { callbackUrl: '/login' })}
                  pl={72}
                  radius="xl"
                  size="lg"
                  variant="default"
                  w={304}
                >
                  Login with Twitter
                </Button>
                <Button
                  classNames={{
                    inner: 'justify-start',
                  }}
                  color="gray"
                  fw={400}
                  leftIcon={<i className="fa-brands fa-discord text-xl text-[#7289da]" />}
                  onClick={() => signIn('discord', { callbackUrl: '/login' })}
                  pl={72}
                  radius="xl"
                  size="lg"
                  variant="default"
                  w={304}
                >
                  Login with Discord
                </Button>
                <Divider
                  className="w-[304px]"
                  label="Or"
                  labelPosition="center"
                  my="xs"
                />
              </>
            )}
            <EthereumSignButton />
            <SuiSignButton />
            <Tooltip
              label="Coming soon"
              withArrow
            >
              <div>
                <Button
                  classNames={{
                    inner: 'justify-start',
                  }}
                  color="gray"
                  disabled
                  fw={400}
                  leftIcon={<WalletIcon />}
                  pl={72}
                  radius="xl"
                  size="lg"
                  variant="default"
                  w={304}
                >
                  Solana Wallet
                </Button>
              </div>
            </Tooltip>
            <Text>
              Have an account?{' '}
              <Link
                href="/login?socials=true"
                className="underline"
              >
                Log in instead
              </Link>
            </Text>
          </Flex>
        </Modal>
      </main>
    </>
  )
}

export default Login

const EthereumSignButton = () => {
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
      notifications.show({
        color: 'red',
        message: (error as Error)?.message,
        title: 'Failed to sign in',
      })
    }
  }

  return (
    <Button
      classNames={{
        inner: 'justify-start',
      }}
      color="gray"
      fw={400}
      leftIcon={<WalletIcon />}
      onClick={() => onConnect()}
      pl={72}
      radius="xl"
      size="lg"
      variant="default"
      w={304}
    >
      Ethereum Wallet
    </Button>
  )
}

const SuiSignButton = () => {
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
      notifications.show({
        color: 'red',
        message: (error as Error)?.message,
        title: 'Failed to sign in',
      })
    }
  }

  return (
    <>
      <ConnectModal
        onConnectSuccess={() => setShowModal(false)}
        onOpenChange={open => setShowModal(open)}
        open={showModal}
      />
      <Button
        classNames={{
          inner: 'justify-start',
        }}
        color="gray"
        fw={400}
        leftIcon={<WalletIcon />}
        onClick={() => onConnect()}
        pl={72}
        radius="xl"
        size="lg"
        variant="default"
        w={304}
      >
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
    </>
  )
}
