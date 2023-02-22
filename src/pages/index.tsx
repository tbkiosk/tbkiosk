import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useWallet, ConnectModal } from '@suiet/wallet-kit'

import { Button } from '@/components'

import { ellipsisMiddle } from '@/utils/address'

let ticking = false

const Index = () => {
  const { connected, address = '', disconnect } = useWallet()

  const [isModalVisible, setModalVisible] = useState(false)
  const [pageYOffset, setPageYOffset] = useState(0)

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
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPageYOffset(window.scrollY)
          ticking = false
        })

        ticking = true
      }
    }

    document.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Head>
        <title>Morphis Network - Welcome</title>
        <meta name="description" content="morphis network welcome" />
      </Head>
      <div
        className="flex flex-col overflow-x-auto overflow-y-auto min-w-[1440px] pt-[96px]"
        id="index-container"
      >
        <ConnectModal
          open={isModalVisible}
          onOpenChange={(open: boolean) => setModalVisible(open)}
        />
        <header className="flex justify-between fixed inset-x-0 top-0 h-[96px] max-h-[96px] px-8 py-6 bg-white z-[1099]">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              alt="logo"
              className="mr-2.5"
              height={42}
              src="/icons/logo.svg"
              width={44}
            />
            <span className="text-xl font-black">MORPHIS</span>
          </div>
          <div className="flex gap-[60px] items-center font-bold text-lg">
            <nav className="transition-opacity hover:opacity-60">
              <a href="/#products">Products</a>
            </nav>
            <nav className="transition-opacity hover:opacity-60">
              <a href="/#features">Features</a>
            </nav>
            <nav className="transition-opacity hover:opacity-60">
              <a href="/#partners">Partners</a>
            </nav>
          </div>
          <div className="flex gap-8 items-center">
            <span className="flex items-center justify-center shrink-0 h-[36px] w-[36px] p-2 text-white bg-black rounded-full">
              <i className="fa-brands fa-twitter fa-l " />
            </span>
            <span className="flex items-center justify-center shrink-0 h-[36px] w-[36px] p-2 text-white bg-black rounded-full">
              <i className="fa-brands fa-discord fa-l" />
            </span>
            <Button
              className="!h-[48px] px-8 !rounded-[60px]"
              onClick={onWalletClick}
              variant="contained"
            >
              {connected ? ellipsisMiddle(address) : 'Connect wallet'}
            </Button>
          </div>
        </header>
        <main className="grow overflow-hidden">
          <section className="h-[520px] max-h-[520px] w-full relative">
            <div className="w-[670px] absolute font-bold text-7xl leading-[96px] top-[88px] left-[96px] -translate-x-[calc(100%+96px)] animate-[fly-in-from-left_1s_ease-in-out_150ms] animation-fill-forwards">
              Connecting the NFT communities
            </div>
            <div className="w-[580px] absolute font-medium text-2xl leading-8 top-[308px] left-[96px] -translate-x-[calc(100%+96px)] animate-[fly-in-from-left_1s_ease-in-out_300ms] animation-fill-forwards">
              Morphis Network is a social platform that allows token-gated
              communities built around NFT ownership
            </div>
            <Link href="/login">
              <Button
                className="!h-[48px] !w-auto px-8 !rounded-[60px] absolute top-[436px] left-[96px] -translate-x-[calc(100%+96px)] animate-[fly-in-from-left_1s_ease-in-out_450ms] animation-fill-forwards"
                variant="contained"
              >
                Get started
              </Button>
            </Link>
            <Image
              alt="peeps"
              className="absolute top-[88px] right-0 object-fit w-[40%] max-w-[888px] max-h-[518px] transition-transform translate-x-full animate-[fly-in-from-right_1s_ease-in-out_450ms] animation-fill-forwards"
              height={518}
              id="peeps"
              src="/images/peeps.svg"
              style={{
                top: pageYOffset > 200 ? `-112px` : `${88 - pageYOffset}px`,
              }}
              width={888}
            />
          </section>
          <section className="flex flex-row mt-[96px]">
            <div className="flex flex-col grow justify-center items-center gap-[48px] py-8 border-r border-r-black">
              <Image
                alt="token"
                height={60}
                src="/icons/token.svg"
                width={60}
              />
              <span className="w-[300px] font-bold text-2xl text-center">
                Token-gated communities centred around NFT
              </span>
            </div>
            <div className="flex flex-col grow justify-center items-center gap-[48px] py-8 border-r border-r-black">
              <Image alt="token" height={60} src="/icons/dao.svg" width={60} />
              <span className="w-[300px] font-bold text-2xl text-center">
                Dao tooling & community insights
              </span>
            </div>
            <div className="flex flex-col grow justify-center items-center gap-[48px] py-8">
              <Image
                alt="token"
                height={60}
                src="/icons/connect.svg"
                width={60}
              />
              <span className="w-[300px] font-bold text-2xl text-center">
                New way to connect to like-minded members
              </span>
            </div>
          </section>
          <p
            className="font-bold text-5xl text-center pt-[81px] pb-[157px]"
            id="products"
          >
            Our Products
          </p>
          <section className="relative">
            <Image
              alt="connect"
              className="absolute"
              height={505}
              src="/images/connect-preview.png"
              width={782}
            />
            <div className="w-[543px] ml-[864px]">
              <p className="text-4xl font-bold leading-[50px] mb-5">
                Morphis Connect
              </p>
              <p className="text-2xl font-medium mb-8">
                A completely new way for communities to form and interact with
                each other. Centred around NFTs.{' '}
              </p>
              <p className="text-2xl font-bold mb-9">
                Token gated communities around NFTs
              </p>
              <p className="text-2xl font-bold mb-9">
                Useful tooling for community management
              </p>
              <p className="text-2xl font-bold mb-9">
                Discover interesting projects & people
              </p>
              <Button
                className="!w-auto !h-[48px] !rounded-[60px] px-[44px] text-lg"
                variant="outlined"
              >
                Coming soon
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Index
