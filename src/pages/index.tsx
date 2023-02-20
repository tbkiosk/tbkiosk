import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'
import cl from 'classnames'

import { ellipsisMiddle } from '@/utils/address'

import { Button } from '@/components'

const Index = () => {
  const { data: session } = useSession()
  const { connecting, connected, address = '', disconnect } = useWallet()
  const router = useRouter()

  const [isModalVisible, setModalVisible] = useState(false)

  const onWalletClick = () => {
    if (connected) {
      disconnect()
      setModalVisible(false)
      return
    }

    setModalVisible(true)
  }

  useEffect(() => {
    if (connected) {
      setModalVisible(false)
    }
  }, [connected, setModalVisible])

  useEffect(() => {
    if (session) {
      router.push('/profile')
    }
  }, [session, router])

  return (
    <>
      <Head>
        <title>Morphis Network</title>
      </Head>
      <main className="h-full flex flex-col justify-center items-center bg-[#f0f3fb] overflow-hidden">
        <ConnectModal
          open={isModalVisible}
          onOpenChange={(open: boolean) => setModalVisible(open)}
        />
        <div className="w-[360px] min-w-[360px]">
          <Image
            alt="stargs"
            height={315}
            src="/images/stars.svg"
            width={360}
          />
          <p className="font-bold text-center text-3xl leading-10 mb-5">
            Get Started
          </p>
          <p className="text-base text-center leading-5 mb-6">
            Your gateway to the top NFT communities and collectors like you!
          </p>
          <Button
            className="border-[#d8dadc] mb-5"
            loading={connecting}
            onClick={() => onWalletClick()}
            startIcon={<i className="fa-solid fa-wallet fa-xl ml-2"></i>}
            variant={connected ? 'contained' : 'outlined'}
          >
            {connected ? (
              <div className="flex justify-center items-center">
                <div className="bg-[#82ffac] h-[14px] w-[14px] rounded-full mr-4" />
                {ellipsisMiddle(address)}
              </div>
            ) : (
              'Connect wallet'
            )}
          </Button>
          <div className="group relative">
            <span
              className={cl([
                'px-4 py-2 text-sm text-gray-100 rounded-md absolute left-1/2 bg-gray-800 invisible z-[1050] opacity-0 transition-opacity',
                'group-hover:visible group-hover:opacity-90 -translate-x-1/2 -translate-y-[120%]',
              ])}
            >
              Coming soon
            </span>
            <Button
              className="border-[#d8dadc] mb-5"
              disabled
              startIcon={<i className="fa-brands fa-twitter fa-xl ml-2" />}
              variant="outlined"
            >
              Connect Twitter
            </Button>
          </div>
          <Button
            className="border-[#d8dadc] mb-5"
            onClick={() => signIn('discord', { callbackUrl: '/profile' })}
            startIcon={<i className="fa-brands fa-discord fa-xl ml-2" />}
            variant="outlined"
          >
            Connect Discord
          </Button>
          <div
            className={cl([
              'text-center font-bold',
              connected ? 'visible' : 'invisible',
            ])}
          >
            <Link
              className="opacity-100 transition-opacity hover:opacity-50"
              href="/profile"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Index
