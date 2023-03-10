import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import cl from 'classnames'

import { Button, Tooltip, Modal } from '@/components'
// import WalletDropdown from '@/layouts/components/wallet_dropdown' // currently do not allow user to connect wallet

import useInViewport from '@/hooks/dom/useInViewport'

const generateFlyInAnimationOptions = (elementId: `#${string}`) => ({
  queryTarget: () => document.querySelector(elementId),
  callback: (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      Array.from(entries[0].target.children || []).forEach(child => {
        child.classList.remove('!animate-none')
      })
    }
  },
})

type ScrollTranslateOptions = {
  target: string
  translateRange: [number, number]
  maxTop: number
}

const useScrollTranslate = ({ target, translateRange, maxTop }: ScrollTranslateOptions) => {
  const [biasPct, setBiasPct] = useState(0)

  const onScroll = () => {
    const dom = document.querySelector(target)
    if (!dom || window.matchMedia('(max-width: 768px)').matches) {
      return
    }

    const bodyHeight = document.body.clientHeight
    const domTop = dom.getBoundingClientRect().top

    if (domTop > bodyHeight) {
      setBiasPct(translateRange[1])
    } else if (domTop < maxTop) {
      setBiasPct(translateRange[0])
    } else {
      const domOffsetTopToBodyPercentage = domTop / bodyHeight
      setBiasPct(translateRange[0] + (translateRange[1] - translateRange[0]) * domOffsetTopToBodyPercentage)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', onScroll)
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return biasPct
}

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const biasPctPeepImage = useScrollTranslate({
    target: '#peeps-container',
    translateRange: [-20, 10],
    maxTop: -400,
  })
  const biasPctConnectImage = useScrollTranslate({
    target: '#connect-container',
    translateRange: [-20, 20],
    maxTop: -400,
  })
  const biasPctWalletImage = useScrollTranslate({
    target: '#wallet-container',
    translateRange: [-20, 20],
    maxTop: -400,
  })

  useInViewport(generateFlyInAnimationOptions('#connect-intro'))
  useInViewport(generateFlyInAnimationOptions('#extension-intro'))
  useInViewport(generateFlyInAnimationOptions('#slogan'))

  return (
    <>
      <Head>
        <title>Morphis Network - Welcome</title>
        <meta
          name="description"
          content="morphis network welcome"
        />
      </Head>
      <div className="overflow-x-auto overflow-y-auto">
        <Modal
          isOpen={modalOpen}
          setOpen={setModalOpen}
          classNames="!bg-black"
        >
          <div className="h-full w-full flex flex-col pt-32 pb-8 px-8">
            <div className="flex flex-col gap-9 text-white">
              <Link
                className="text-3xl"
                href="/#products"
                scroll={false}
              >
                Products
              </Link>
              <Link
                className="text-3xl"
                href="/#partners"
                scroll={false}
              >
                Partners
              </Link>
            </div>
            <div className="flex flex-row grow items-end">
              <div className="flex gap-8">
                <a
                  className="transition-opacity hover:opacity-80"
                  href="https://twitter.com/morphis_network"
                  rel="noreferrer"
                  target="_blank"
                >
                  <i className="fa-brands fa-twitter w-9 h-9 flex justify-center items-center text-lg text-black bg-white rounded-full" />
                </a>
                <a
                  className="transition-opacity hover:opacity-80"
                  href="http://discord.gg/morphis"
                  rel="noreferrer"
                  target="_blank"
                >
                  <i className="fa-brands fa-discord w-9 h-9 flex justify-center items-center text-lg text-black bg-white rounded-full" />
                </a>
                <a
                  className="transition-opacity hover:opacity-80"
                  href="https://medium.com/@morphis"
                  rel="noreferrer"
                  target="_blank"
                >
                  <i className="fa-brands fa-medium w-9 h-9 flex justify-center items-center text-lg text-black bg-white rounded-full" />
                </a>
              </div>
            </div>
          </div>
        </Modal>
        <header
          className={cl([
            'flex justify-between fixed inset-x-0 top-0 h-24 max-h-24 2xl:px-14 lg:px-10 px-6 md:py-6 py-2 bg-white z-[1201]',
            modalOpen && 'invert',
          ])}
        >
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
          <div className="hidden md:flex 2xl:gap-[3.75rem] lg:gap-12 gap-8 items-center font-bold lg:text-lg text-base">
            <nav className="transition-opacity hover:opacity-60">
              <Link
                href="/#products"
                scroll={false}
              >
                Products
              </Link>
            </nav>
            <nav className="transition-opacity hover:opacity-60">
              <Link
                href="/#partners"
                scroll={false}
              >
                Partners
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              className="transition-opacity hover:opacity-80"
              href="https://twitter.com/morphis_network"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-twitter w-9 h-9 flex justify-center items-center text-lg text-white bg-black rounded-full" />
            </a>
            <a
              className="transition-opacity hover:opacity-80"
              href="http://discord.gg/morphis"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-discord w-9 h-9 flex justify-center items-center text-lg text-white bg-black rounded-full" />
            </a>
            <Tooltip
              position="bottom"
              tip="Coming soon"
            >
              <Button className="h-12 px-6">Connect wallets</Button>
            </Tooltip>
          </div>
          <div className="flex md:hidden items-center active:opacity-50">
            {modalOpen ? (
              <i
                className="fa-solid fa-xmark text-xl"
                onClick={() => setModalOpen(false)}
              />
            ) : (
              <i
                className="fa-solid fa-bars text-xl"
                onClick={() => setModalOpen(true)}
              />
            )}
          </div>
        </header>
        <main className="pt-24 md:px-0 px-4 overflow-hidden">
          <section className="md:h-[32.5rem] h-[42rem] w-full relative">
            <div
              className={cl([
                'md:w-[40%] w-full md:max-w-[42rem] max-w-full',
                'absolute 2xl:top-[5.5rem] lg:top-28 md:top-36 top-10 2xl:left-24 lg:left-20 md:left-16 left-0',
                'font-bold 2xl:text-7xl lg:text-5xl text-4xl 2xl:leading-[6rem] lg:leading-[4rem] leading-10',
                '-translate-x-[calc(100%+6rem)] animate-[fly-in-from-left_1s_ease-in-out_150ms] animation-fill-forwards',
              ])}
            >
              Connecting the NFT communities
            </div>
            <div
              className={cl([
                'md:w-[40%] w-full max-w-[36.25rem] max-w-full',
                'absolute 2xl:top-[19.25rem] lg:top-[17rem] md:top-[16rem] top-[9rem] 2xl:left-24 lg:left-20 md:left-16 left-0',
                'font-medium 2xl:text-2xl 2xl:leading-8 lg:text-xl lg:leading-7 text-lg leading-6',
                '-translate-x-[calc(100%+6rem)] animate-[fly-in-from-left_1s_ease-in-out_300ms] animation-fill-forwards',
              ])}
            >
              Morphis Network is a social platform that allows token-gated communities built around NFT ownership
            </div>
            <Link
              className={cl([
                'absolute 2xl:top-[27.25rem] lg:top-96 md:top-[22rem] top-[16rem] 2xl:left-24 lg:left-20 md:left-16 left-0',
                '-translate-x-[calc(100%+6rem)] animate-[fly-in-from-left_1s_ease-in-out_450ms] animation-fill-forwards',
              ])}
              href="/login"
            >
              <Button
                className="!h-12 !w-auto px-8 !rounded-[3.75rem]"
                variant="outlined"
              >
                Get started
              </Button>
            </Link>
            <div
              className={cl([
                'absolute object-fit md:w-[40%] w-[120%] h-[50%] md:max-w-[55rem] max-w-[32rem] max-h-[32.5rem]',
                'lg:top-36 md:top-32 top-[22rem] md:right-0 -right-4',
                'transition-transform translate-x-full animate-[fly-in-from-right_1s_ease-in-out_450ms] animation-fill-forwards',
              ])}
              id="peeps-container"
            >
              <Image
                alt="peeps"
                height={518}
                id="peeps"
                src="/images/peeps.svg"
                style={{ transform: `translateY(${biasPctPeepImage + 10}%)` }}
                width={888}
              />
            </div>
          </section>

          <section className="flex md:flex-row flex-col items-center 2xl:mt-24 lg:mt-12 mt-0">
            <div
              className={cl([
                'md:w-2/6 w-[70%] flex flex-col justify-center items-center gap-12 py-8',
                'md:border-r md:border-r-black border-r-0 md:border-b-0 border-b-black border-b',
              ])}
            >
              <Image
                alt="token"
                className="animate-[step-spin_6s_ease-in-out_infinite] animation-fill-forwards"
                height={60}
                src="/icons/token.svg"
                width={60}
              />
              <span className="md:w-[70%] max-w-[18.75rem] font-bold 2xl:text-2xl lg:text-xl text-lg text-center">
                Token-gated communities centred around NFT
              </span>
            </div>
            <div
              className={cl([
                'md:w-2/6 w-[70%] flex flex-col justify-center items-center gap-12 py-8',
                'md:border-r md:border-r-black border-r-0 md:border-b-0 border-b-black border-b',
              ])}
            >
              <Image
                alt="dao"
                className="animate-[step-spin_6s_ease-in-out_2s_infinite] animation-fill-forwards"
                height={60}
                src="/icons/dao.svg"
                width={60}
              />
              <span className="md:w-[70%] max-w-[18.75rem] font-bold 2xl:text-2xl lg:text-xl text-lg text-center">
                Dao tooling & community insights
              </span>
            </div>
            <div className="md:w-2/6 w-[70%] flex flex-col justify-center items-center gap-12 py-8">
              <Image
                alt="connect"
                className="animate-[step-spin_6s_ease-in-out_4s_infinite] animation-fill-forwards"
                height={60}
                src="/icons/connect.svg"
                width={60}
              />
              <span className="md:w-[70%] max-w-[18.75rem] font-bold 2xl:text-2xl lg:text-xl text-lg text-center">
                New way to connect to like-minded members
              </span>
            </div>
          </section>

          <section className="relative md:h-[50rem] h-[56rem] md:mb-0 mb-14">
            <p
              className="font-bold text-5xl text-center pt-20 2xl:pb-40 lg:pb-28 md:pb-20 pb-10"
              id="products"
            >
              Our Products
            </p>
            <div
              className="md:w-[45%] w-full max-w-[37.75rem] md:absolute relative md:right-0 right-auto md:left-auto left-0"
              id="connect-intro"
            >
              <p className="font-bold 2xl:text-4xl lg:text-3xl text-2xl mb-5">Morphis Connect</p>
              <p
                className={cl([
                  '2xl:text-2xl lg:text-xl text-lg font-medium',
                  '2xl:pr-16 lg:pr-12 md:pr-8 pr-0 mb-8',
                  'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
                style={{ animationDelay: '0.5s' }}
              >
                A completely new way for communities to form and interact with each other. Centred around NFTs.
              </p>
              <p
                className={cl([
                  'flex items-center gap-3',
                  '2xl:text-2xl lg:text-xl text-lg font-bold',
                  '2xl:mb-9 lg:mb-7 mb-6 2xl:pr-16 lg:pr-12 md:pr-8 pr-0',
                  'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
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
                className={cl([
                  'flex items-center gap-3',
                  '2xl:text-2xl lg:text-xl text-lg font-bold',
                  '2xl:mb-9 lg:mb-7 mb-6 2xl:pr-16 lg:pr-12 md:pr-8 pr-0',
                  'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
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
                className={cl([
                  'flex items-center gap-3',
                  '2xl:text-2xl lg:text-xl text-lg font-bold',
                  '2xl:mb-9 lg:mb-7 mb-6 2xl:pr-16 lg:pr-12 md:pr-8 pr-0',
                  'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
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
                className="!h-12 !w-auto px-8 !rounded-[3.75rem]"
                variant="outlined"
              >
                Coming soon
              </Button>
            </div>
            <div
              className="md:w-[45%] w-full max-w-[48.75rem] md:absolute relative left-0 md:mt-0 mt-8 md:ml-0 -ml-8"
              id="connect-container"
            >
              <Image
                alt="connect"
                height={505}
                src="/images/connect-preview.png"
                style={{ transform: `translateY(${biasPctConnectImage + 10}%)` }}
                width={782}
              />
            </div>
          </section>

          <section className="relative 2xl:h-[37.5rem] lg:h-[35rem] md:h-[32rem] 2xl:mt-24 lg:mt-12 mt-0 md:mb-0 mb-20">
            <div className="md:w-[50%] max-w-[50rem] w-full h-full absolute right-0 md:block hidden">
              <div
                className="w-full h-full relative"
                id="wallet-container"
              >
                <Image
                  alt="wallet-preview"
                  className="w-[50%] max-h-[35rem] absolute right-[35%] object-contain"
                  height={560}
                  src="/images/wallet-preview-1.png"
                  style={{ transform: `translateY(${biasPctWalletImage + 10}%)` }}
                  width={373}
                />
                <Image
                  alt="wallet-preview-2"
                  className="w-[50%] max-h-[35rem] absolute -right-[20%] object-contain"
                  height={560}
                  src="/images/wallet-preview-2.png"
                  style={{ transform: `translateY(${biasPctWalletImage + 10}%)` }}
                  width={373}
                />
              </div>
            </div>
            <div
              className="md:w-[50%] md:absolute w-full relative"
              id="extension-intro"
            >
              <p className="font-bold 2xl:text-4xl lg:text-3xl text-2xl 2xl:pl-24 lg:pl-16 md:pl-8 pl-0 mb-5">Wallet Extension</p>
              <p
                className={cl([
                  '2xl:text-2xl lg:text-xl text-lg font-medium',
                  '2xl:pl-24 lg:pl-16 md:pl-8 pl-0 mb-8',
                  '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
                style={{ animationDelay: '0.5s' }}
              >
                Social enabled wallet extension to get started with your web3 journey.
              </p>
              <p
                className={cl([
                  'flex items-center gap-3 font-bold',
                  '2xl:mb-9 lg:mb-7 mb-6 2xl:text-2xl lg:text-xl text-lg 2xl:pl-24 lg:pl-16 md:pl-8 pl-0',
                  '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
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
                className={cl([
                  'flex items-center gap-3 font-bold',
                  '2xl:mb-9 lg:mb-7 mb-6 2xl:text-2xl lg:text-xl text-lg 2xl:pl-24 lg:pl-16 md:pl-8 pl-0',
                  '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
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
                className={cl([
                  'flex items-center gap-3 font-bold',
                  '2xl:mb-9 lg:mb-7 mb-6 2xl:text-2xl lg:text-xl text-lg 2xl:pl-24 lg:pl-16 md:pl-8 pl-0',
                  '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none',
                ])}
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
                className="2xl:pl-24 lg:pl-16 md:pl-8 pl-0"
                href="https://chrome.google.com/webstore/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi"
                rel="noreferrer"
                target="_blank"
              >
                <Button
                  className="!h-12 !w-auto px-8 !rounded-[3.75rem]"
                  variant="contained"
                >
                  Download extension
                </Button>
              </a>
            </div>
          </section>

          <section>
            <p
              className="font-bold text-5xl text-center 2xl:pt-20 lg:pt-10 pt-0 2xl:pb-36 lg:pb-28 pb-20"
              id="partners"
            >
              Our Partners
            </p>
            <div className="h-[4.5rem] relative overflow-hidden">
              <Marquee speed={60}>
                <div className={cl(['flex flex-row items-center gap-20 h-full mx-10'])}>
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
                    <span className="font-bold whitespace-nowrap ml-4">Sui Name Service</span>
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
            className="flex flex-col justify-center items-center h-[25rem] mt-32 md:mx-0 -mx-4 bg-black text-white"
            id="slogan"
          >
            <div
              className={cl([
                'flex items-center gap-12 w-[22.5rem] -mb-3 text-5xl font-bold z-[1010] opacity-0 overflow-hidden',
                'animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards !animate-none',
              ])}
              style={{ animationDelay: '1s' }}
            >
              <div className="h-16 w-16 rounded-full bg-[#fce2f9] md:ml-0 ml-4" />
              <span>Discover.</span>
            </div>
            <div
              className={cl([
                'flex items-center gap-12 w-[22.5rem] -mb-3 text-5xl font-bold z-[1010] opacity-0 overflow-hidden',
                'animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards !animate-none',
              ])}
              style={{ animationDelay: '2s' }}
            >
              <div className="h-16 w-16 rounded-full bg-[#c481c1] md:ml-0 ml-4" />
              <span>Connect.</span>
            </div>
            <div
              className={cl([
                'flex items-center gap-12 w-[22.5rem] -mb-3 text-5xl font-bold z-[1010] opacity-0 overflow-hidden',
                'animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards !animate-none',
              ])}
              style={{ animationDelay: '3s' }}
            >
              <div className="h-16 w-16 rounded-full bg-white md:ml-0 ml-4" />
              <span>Engage.</span>
            </div>
          </section>

          <section className="2xl:mt-28 lg:mt-20 mt-14 md:mb-28 mb-14">
            <p className="font-bold text-5xl text-center pb-12">Join Our Community</p>
            <div className="flex md:flex-row flex-col justify-center gap-4 md:px-8 px-0">
              <a
                className="max-w-[35rem] flex grow items-center gap-4 px-10 py-4 border border-black transition-colors hover:bg-[#ddd]"
                href="https://twitter.com/morphis_network"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-twitter w-12 h-12 flex justify-center items-center shrink-0 text-xl text-white bg-black rounded-full" />
                <span className="2xl:text-2xl lg:text-xl text-lg font-black">Follow Us on Twitter</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-lg" />
              </a>
              <a
                className="max-w-[35rem] flex grow items-center gap-4 px-10 py-4 border border-black transition-colors hover:bg-[#ddd]"
                href="http://discord.gg/morphis"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-discord w-12 h-12 flex justify-center items-center shrink-0 text-xl text-white bg-black rounded-full" />
                <span className="2xl:text-2xl lg:text-xl text-lg font-black">Join Discord</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-lg" />
              </a>
            </div>
          </section>
        </main>
        <footer className="flex md:flex-row flex-col md:justify-between md:items-center items-start 2xl:px-14 lg:px-10 px-6 py-6 bg-black">
          <div className="flex gap-8">
            <a
              className="transition-opacity hover:opacity-80"
              href="https://twitter.com/morphis_network"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-twitter w-9 h-9 flex justify-center items-center text-lg text-black bg-white rounded-full" />
            </a>
            <a
              className="transition-opacity hover:opacity-80"
              href="http://discord.gg/morphis"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-discord w-9 h-9 flex justify-center items-center text-lg text-black bg-white rounded-full" />
            </a>
            <a
              className="transition-opacity hover:opacity-80"
              href="https://medium.com/@morphis"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-medium w-9 h-9 flex justify-center items-center text-lg text-black bg-white rounded-full" />
            </a>
          </div>
          <div className="text-white md:mt-0 mt-4">© 2023 Morphis Network</div>
        </footer>
      </div>
    </>
  )
}

export default Index
