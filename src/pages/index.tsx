import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'

import { Button } from '@/components'

const Index = () => {
  const { connecting, connected, address = '', disconnect } = useWallet()

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

  return (
    <>
      <Head>
        <title>Morphis Network - Welcome</title>
        <meta name="description" content="morphis network welcome" />
      </Head>
      <div className="flex flex-col">
        <header className="flex justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <Image
              alt="logo"
              className="mr-2.5"
              height={42}
              src="/icons/logo.svg"
              width={44}
            />
            <span className="text-xl font-black">MORPHIS</span>
          </div>
          <div className="flex gap-4 items-center">
            <nav>Products</nav>
            <nav>Features</nav>
            <nav>Partners</nav>
          </div>
          <div className="flex gap-4 items-center">
            <i className="fa-brands fa-twitter fa-xl" />
            <i className="fa-brands fa-discord fa-xl" />
            <Button variant="contained">Connect wallet</Button>
          </div>
        </header>
        <main className="flex flex-col grow justify-center items-center bg-[#f0f3fb] overflow-hidden">
          <ConnectModal
            open={isModalVisible}
            onOpenChange={(open: boolean) => setModalVisible(open)}
          />
          main
        </main>
      </div>
    </>
  )
}

export default Index
