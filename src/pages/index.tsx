import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import cl from 'classnames'

import { Button } from '@/components'
import WalletDropdown from '@/layouts/components/wallet_dropdown'

import useInViewport from '@/hooks/dom/useInViewport'

let ticking = false

const Index = () => {
  const router = useRouter()

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })

        ticking = true
      }
    }

    document.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useInViewport({
    queryTarget: () => document.querySelector('#slogan'),
    callback: (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        Array.from(entries[0].target.children || []).forEach((child) => {
          child.classList.remove('animate-none')
        })
      }
    },
  })
  useInViewport({
    queryTarget: () => document.querySelector('#connect-intro'),
    callback: (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        Array.from(entries[0].target.children || []).forEach((child) => {
          child.classList.remove('!animate-none')
        })
      }
    },
  })
  useInViewport({
    queryTarget: () => document.querySelector('#extension-intro'),
    callback: (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        Array.from(entries[0].target.children || []).forEach((child) => {
          child.classList.remove('!animate-none')
        })
      }
    },
  })

  return (
    <>
      <Head>
        <title>Morphis Network - Welcome</title>
        <meta name="description" content="morphis network welcome" />
      </Head>
      <div className="overflow-x-auto overflow-y-auto min-w-[1440px]">
        <header className="flex justify-between fixed inset-x-0 top-0 h-[96px] max-h-[96px] px-[54px] py-6 bg-white z-[1099]">
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
              <Link href="/#products" scroll={false}>
                Products
              </Link>
            </nav>
            <nav className="transition-opacity hover:opacity-60">
              <Link href="/#partners" scroll={false}>
                Partners
              </Link>
            </nav>
          </div>
          <div className="flex gap-8 items-center">
            <a
              className="transition-opacity hover:opacity-80"
              href="https://twitter.com/morphis_network"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="twitter"
                height={36}
                src="/icons/twitter-circle.svg"
                width={36}
              />
            </a>
            <a
              className="transition-opacity hover:opacity-80"
              href="http://discord.gg/morphis"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="discord"
                height={36}
                src="/icons/discord-circle.svg"
                width={36}
              />
            </a>
            <WalletDropdown
              onWalletSelectSuccess={() => router.push('/login')}
            />
          </div>
        </header>
        <main className="overflow-hidden">
          <section className="h-[96px]" />
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
                variant="outlined"
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
                top: scrollY > 200 ? `-112px` : `${88 - scrollY}px`,
              }}
              width={888}
            />
          </section>

          <section className="flex flex-row mt-[96px]">
            <div className="flex flex-col grow justify-center items-center gap-[48px] py-8 border-r border-r-black">
              <Image
                alt="token"
                className="animate-[step-spin_6s_ease-in-out_infinite] animation-fill-forwards"
                height={60}
                src="/icons/token.svg"
                width={60}
              />
              <span className="w-[300px] font-bold text-2xl text-center">
                Token-gated communities centred around NFT
              </span>
            </div>
            <div className="flex flex-col grow justify-center items-center gap-[48px] py-8 border-r border-r-black">
              <Image
                alt="dao"
                className="animate-[step-spin_6s_ease-in-out_2s_infinite] animation-fill-forwards"
                height={60}
                src="/icons/dao.svg"
                width={60}
              />
              <span className="w-[300px] font-bold text-2xl text-center">
                Dao tooling & community insights
              </span>
            </div>
            <div className="flex flex-col grow justify-center items-center gap-[48px] py-8">
              <Image
                alt="connect"
                className="animate-[step-spin_6s_ease-in-out_4s_infinite] animation-fill-forwards"
                height={60}
                src="/icons/connect.svg"
                width={60}
              />
              <span className="w-[300px] font-bold text-2xl text-center">
                New way to connect to like-minded members
              </span>
            </div>
          </section>

          <section className="relative h-[896px]">
            <p
              className="font-bold text-5xl text-center pt-[81px] pb-[157px]"
              id="products"
            >
              Our Products
            </p>
            <Image
              alt="connect"
              className="absolute left-0"
              height={505}
              src="/images/connect-preview.png"
              style={{
                top:
                  scrollY < 544 ? '388px' : `${388 - (scrollY - 544) * 0.5}px`,
              }}
              width={782}
            />
            <div className="w-[573px] absolute right-0" id="connect-intro">
              <p className="text-4xl font-bold leading-[50px] mb-5">
                Morphis Connect
              </p>
              <p
                className="text-2xl font-medium mb-8 pr-[68px] translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '0.5s' }}
              >
                A completely new way for communities to form and interact with
                each other. Centred around NFTs.
              </p>
              <p
                className="flex items-center gap-3 text-2xl font-bold mb-9 pr-[68px] translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '0.75s' }}
              >
                <Image
                  alt="connect"
                  height={20}
                  src="/icons/connect.svg"
                  width={20}
                />
                Token gated communities around NFTs
              </p>
              <p
                className="flex items-center gap-3 text-2xl font-bold mb-9 pr-[68px] translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '1s' }}
              >
                <Image
                  alt="connect"
                  height={20}
                  src="/icons/connect.svg"
                  width={20}
                />
                Useful tooling for community management
              </p>
              <p
                className="flex items-center gap-3 text-2xl font-bold mb-9 pr-[68px] translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '1.25s' }}
              >
                <Image
                  alt="connect"
                  height={20}
                  src="/icons/connect.svg"
                  width={20}
                />
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

          <section className="relative h-[604px] mt-[100px]">
            <Image
              alt="wallet-preview"
              className="absolute right-[252px]"
              height={560}
              src="/images/wallet-preview-1.png"
              style={{
                top:
                  scrollY < 1208
                    ? '150px'
                    : `${150 - (scrollY - 1208) * 0.5}px`,
              }}
              width={353}
            />
            <Image
              alt="wallet-preview"
              className="h-[560px] absolute -right-[83px] object-contain"
              height={560}
              src="/images/wallet-preview-2.png"
              style={{
                top:
                  scrollY < 1208
                    ? '150px'
                    : `${150 - (scrollY - 1208) * 0.5}px`,
              }}
              width={353}
            />
            <div className="w-[543px] absolute" id="extension-intro">
              <p className="text-4xl font-bold leading-[50px] mb-5 pl-[82px]">
                Wallet Extension
              </p>
              <p
                className="text-2xl font-medium mb-8 pl-[82px] -translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '0.5s' }}
              >
                Social enabled wallet extension to get started with your web3
                journey.
              </p>
              <p
                className="flex items-center gap-3 text-2xl font-bold mb-9 pl-[82px] -translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '0.75s' }}
              >
                <Image
                  alt="connect"
                  height={20}
                  src="/icons/connect.svg"
                  width={20}
                />
                Unified web2 and web3 profile
              </p>
              <p
                className="flex items-center gap-3 text-2xl font-bold mb-9 pl-[82px] -translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '1s' }}
              >
                <Image
                  alt="connect"
                  height={20}
                  src="/icons/connect.svg"
                  width={20}
                />
                Manage NFT portfolio with ease
              </p>
              <p
                className="flex items-center gap-3 text-2xl font-bold mb-9 pl-[82px] -translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none"
                style={{ animationDelay: '1.25s' }}
              >
                <Image
                  alt="connect"
                  height={20}
                  src="/icons/connect.svg"
                  width={20}
                />
                Transactions directly to social accounts
              </p>
              <a
                className="pl-[82px]"
                href="https://chrome.google.com/webstore/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi"
                rel="noreferrer"
                target="_blank"
              >
                <Button
                  className="!w-auto !h-[48px] !rounded-[60px] px-[44px] text-lg"
                  variant="contained"
                >
                  Download extension
                </Button>
              </a>
            </div>
          </section>

          <section>
            <p
              className="font-bold text-5xl text-center pt-[81px] pb-[157px]"
              id="partners"
            >
              Our Partners
            </p>
            <div className="h-[72px] relative overflow-hidden">
              <Marquee speed={60}>
                <div
                  className={cl([
                    'flex flex-row items-center gap-[84px] h-full mx-[42px]',
                  ])}
                >
                  <Image
                    alt="clutchy"
                    height={44}
                    src="/icons/partners/clutchy.svg"
                    width={162}
                  />
                  <Image
                    alt="shinami"
                    height={39}
                    src="/icons/partners/shinami.svg"
                    width={196}
                  />
                  <Image
                    alt="bluemove"
                    height={32}
                    src="/icons/partners/bluemove.svg"
                    width={205}
                  />
                  <Image
                    alt="star"
                    height={35}
                    src="/icons/partners/star.svg"
                    width={103}
                  />
                  <Image
                    alt="suipad"
                    height={74}
                    src="/icons/partners/suipad.svg"
                    width={74}
                  />
                  <div className="flex flex-row items-center shrink-0">
                    <Image
                      alt="suins"
                      height={44}
                      src="/icons/partners/suins.svg"
                      width={44}
                    />
                    <span className="font-bold whitespace-nowrap ml-4">
                      Sui Name Service
                    </span>
                  </div>
                  <Image
                    alt="ez"
                    height={44}
                    src="/icons/partners/ez.png"
                    width={44}
                  />
                </div>
              </Marquee>
            </div>
          </section>

          <section
            className="flex flex-col justify-center items-center h-[408px] mt-[133px] bg-black text-white"
            id="slogan"
          >
            <div
              className="flex items-center gap-[46px] w-[360px] -mb-3 text-5xl font-bold z-[1010] opacity-0 animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards animate-none"
              style={{ animationDelay: '1s' }}
            >
              <div className="h-[66px] w-[66px] rounded-full bg-[#fce2f9]" />
              <span>Discover.</span>
            </div>
            <div
              className="flex items-center gap-[46px] w-[360px] -mb-3 text-5xl font-bold z-[1011] opacity-0 animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards animate-none"
              style={{ animationDelay: '2s' }}
            >
              <div className="h-[66px] w-[66px] rounded-full bg-[#c481c1]" />
              <span>Connect.</span>
            </div>
            <div
              className="flex items-center gap-[46px] w-[360px] text-5xl font-bold z-[1012] opacity-0 animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards animate-none"
              style={{ animationDelay: '3s' }}
            >
              <div className="h-[66px] w-[66px] rounded-full bg-white" />
              <span>Engage.</span>
            </div>
          </section>

          <section className="mt-[52px] mb-[90px]">
            <p className="font-bold text-5xl text-center pb-[48px]">
              Join Our Community
            </p>
            <div className="flex gap-[18px] justify-center">
              <a
                className="flex items-center gap-4 w-[551px] px-10 py-4 border border-black transition-colors hover:bg-[#ddd]"
                href="https://twitter.com/morphis_network"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt="twitter"
                  height={48}
                  src="/icons/twitter-circle.svg"
                  width={48}
                />
                <span className="text-2xl font-black">
                  Follow Us on Twitter
                </span>
                <Image
                  alt="link"
                  height={18}
                  src="/icons/arrow-link.svg"
                  width={18}
                />
              </a>
              <a
                className="flex items-center gap-4 w-[551px] px-10 py-4 border border-black transition-colors hover:bg-[#ddd]"
                href="http://discord.gg/morphis"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt="discord"
                  height={48}
                  src="/icons/discord-circle.svg"
                  width={48}
                />
                <span className="text-2xl font-black">Join Discord</span>
                <Image
                  alt="link"
                  height={18}
                  src="/icons/arrow-link.svg"
                  width={18}
                />
              </a>
            </div>
          </section>
        </main>
        <footer className="flex justify-between items-center h-[105px] px-[54px] py-6 bg-black">
          <div className="flex gap-8">
            <a
              className="transition-opacity hover:opacity-80"
              href="https://twitter.com/morphis_network"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="twitter"
                className="invert"
                height={36}
                src="/icons/twitter-circle.svg"
                width={36}
              />
            </a>
            <a
              className="transition-opacity hover:opacity-80"
              href="http://discord.gg/morphis"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="discord"
                className="invert"
                height={36}
                src="/icons/discord-circle.svg"
                width={36}
              />
            </a>
            <a
              className="flex items-center justify-center shrink-0 h-[36px] w-[36px] p-2 text-black bg-white rounded-full transition-opacity hover:opacity-80"
              href="https://medium.com/@morphis"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="medium"
                height={36}
                src="/icons/medium-circle.svg"
                width={36}
              />
            </a>
          </div>
          <div className="text-white">© 2023 Morphis Network</div>
        </footer>
      </div>
    </>
  )
}

export default Index
