import { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classix'
import { Header, Footer, Modal, Burger, Button, Flex, Center, Anchor, Text, rem, useMantineColorScheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import Logo from '@/assets/icons/logo'
import ConnectIcon from '@/assets/icons/connect'

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
  const { colorScheme } = useMantineColorScheme()

  const [opened, { toggle, close }] = useDisclosure(false)

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
        <title>Morphis Airdawg - Welcome</title>
        <meta
          name="description"
          content="Morphis Airdawg welcome"
        />
      </Head>
      <Modal
        classNames={{
          body: 'h-full',
        }}
        fullScreen
        onClose={close}
        opened={opened}
        transitionProps={{ transition: 'fade', duration: 200 }}
        withCloseButton={false}
        zIndex={1099}
      >
        <div className="h-full w-full flex flex-col pt-32 pb-8 px-8">
          <div
            className="flex flex-col gap-9"
            onClick={() => close()}
          >
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
      <Header
        className={cx('flex justify-between fixed max-h-24 2xl:px-14 lg:px-10 px-6 md:py-6 py-2 z-[1201]')}
        fixed
        height={rem(96)}
        withBorder={false}
      >
        <Flex
          align="center"
          className="cursor-pointer"
        >
          <Logo />
        </Flex>
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
        <Flex
          align="center"
          gap={rem(32)}
          className="hidden md:flex"
        >
          <Anchor
            className="transition-opacity hover:opacity-80"
            href="https://twitter.com/morphis_network"
            rel="noreferrer"
            target="_blank"
            underline={false}
          >
            <i className="fa-brands fa-twitter w-9 h-9 flex justify-center items-center text-lg text-white bg-black rounded-full" />
          </Anchor>
          <Anchor
            className="transition-opacity hover:opacity-80"
            href="http://discord.gg/morphis"
            rel="noreferrer"
            target="_blank"
            underline={false}
          >
            <i className="fa-brands fa-discord w-9 h-9 flex justify-center items-center text-lg text-white bg-black rounded-full" />
          </Anchor>
          <Link href="/login">
            <Button
              className="transition-opacity hover:opacity-80"
              color="dark"
              radius="xl"
            >
              Get started
            </Button>
          </Link>
        </Flex>
        <Center className="md:hidden">
          <Burger
            onClick={toggle}
            opened={opened}
            size="sm"
          />
        </Center>
      </Header>
      <main className="pt-24 md:px-0 px-4 overflow-hidden">
        <section className="md:h-[32.5rem] h-[42rem] w-full relative">
          <div
            className={cx(
              'md:w-[40%] w-full md:max-w-[42rem] max-w-full',
              'absolute 2xl:top-[5.5rem] lg:top-28 md:top-36 top-10 2xl:left-24 lg:left-20 md:left-16 left-0',
              'font-bold 2xl:text-7xl lg:text-5xl text-4xl 2xl:leading-[6rem] lg:leading-[4rem] leading-10',
              '-translate-x-[calc(100%+6rem)] animate-[fly-in-from-left_1s_ease-in-out_150ms] animation-fill-forwards'
            )}
          >
            Connecting the NFT communities
          </div>
          <div
            className={cx(
              'md:w-[40%] w-full max-w-[36.25rem] max-w-full',
              'absolute 2xl:top-[19.25rem] lg:top-[17rem] md:top-[16rem] top-[9rem] 2xl:left-24 lg:left-20 md:left-16 left-0',
              'font-medium 2xl:text-2xl 2xl:leading-8 lg:text-xl lg:leading-7 text-lg leading-6',
              '-translate-x-[calc(100%+6rem)] animate-[fly-in-from-left_1s_ease-in-out_300ms] animation-fill-forwards'
            )}
          >
            Morphis Network is a social platform that allows token-gated communities built around NFT ownership
          </div>
          <div
            className={cx(
              'absolute 2xl:top-[27.25rem] lg:top-96 md:top-[22rem] top-[16rem] 2xl:left-24 lg:left-20 md:left-16 left-0',
              '-translate-x-[calc(100%+6rem)] animate-[fly-in-from-left_1s_ease-in-out_450ms] animation-fill-forwards'
            )}
          >
            <Link href="/login">
              <Button
                className="transition-opacity hover:opacity-80"
                color="dark"
                radius="xl"
              >
                Get started
              </Button>
            </Link>
          </div>
          <div
            className={cx(
              'absolute object-fit md:w-[40%] w-[120%] h-[50%] md:max-w-[55rem] max-w-[32rem] max-h-[32.5rem]',
              'lg:top-36 md:top-32 top-[22rem] md:right-0 -right-4',
              'transition-transform translate-x-full animate-[fly-in-from-right_1s_ease-in-out_450ms] animation-fill-forwards'
            )}
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
            className={cx(
              'md:w-2/6 w-[70%] flex flex-col justify-center items-center gap-12 py-8',
              'md:border-r md:border-r-black border-r-0 md:border-b-0 border-b-black border-b'
            )}
          >
            <div className="h-[60px] w-[60px] animate-[step-spin_6s_ease-in-out_infinite] animation-fill-forwards">
              <svg
                className="h-full w-full"
                width="61"
                height="61"
                viewBox="0 0 61 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_54_1266)">
                  <path
                    d="M61 28.1054H42.0614V31.6576L41.553 34.0336L40.564 36.2602L39.1367 38.2253L37.3314 39.8544L35.2276 41.0681L32.9186 41.8196L30.5023 42.0717L28.086 41.8196L25.7723 41.0681L23.6686 39.8544L21.8633 38.2253L20.436 36.2602L19.4424 34.0336L18.9386 31.6576V29.2257L19.4564 26.7984L19.4657 26.803L20.4126 24.6698L3.11134 16.9631L2.16441 19.0917L19.3771 26.7657L0.932936 22.84L0.401162 25.3513L17.7444 29.0389H0V31.8397H16.0605L0.326527 35.1866L1.00757 38.3841L15.6453 35.2706L1.97316 41.3622L3.30259 44.3496L15.9485 38.7108L4.72998 46.8703L6.92238 49.8904L17.0541 42.5245L8.67164 51.8416L11.5124 54.4043L19.6709 45.3345L13.5742 55.9027L16.9281 57.8398L22.9689 47.3697L19.2325 58.8714L22.9176 60.0664L26.7519 48.252L25.4551 60.5986L29.1682 60.9907L30.4417 48.8635L31.7151 61L35.6615 60.5892L34.4533 49.1202L38.0171 60.0898L41.8328 58.8481L38.339 48.0933L43.9926 57.8865L47.5051 55.856L41.9681 46.2541L49.3849 54.4976L52.431 51.7482L45.0934 43.5888L53.9703 50.0444L56.382 46.7209L47.5051 40.2652L57.5295 44.7324L59.1994 40.9794L49.8934 36.8343L59.8711 38.9582L60.7948 34.6171L52.1324 32.7733H61V28.1054Z"
                    fill="currentColor"
                  />
                  <path
                    d="M58.0796 17.3898L40.7783 25.0981L41.3475 26.3774L58.6488 18.6691L58.0796 17.3898Z"
                    fill="currentColor"
                  />
                  <path
                    d="M54.7528 11.9159L39.4312 23.0554L40.2811 24.226L55.6028 13.0866L54.7528 11.9159Z"
                    fill="currentColor"
                  />
                  <path
                    d="M50.3528 7.26052L37.6804 21.3443L38.7897 22.3438L51.4621 8.26002L50.3528 7.26052Z"
                    fill="currentColor"
                  />
                  <path
                    d="M45.0818 3.62634L35.6125 20.0389L36.9457 20.8091L46.415 4.39654L45.0818 3.62634Z"
                    fill="currentColor"
                  />
                  <path
                    d="M39.1697 1.17322L33.3174 19.1973L34.8258 19.6877L40.6781 1.66365L39.1697 1.17322Z"
                    fill="currentColor"
                  />
                  <path
                    d="M32.8728 0.00357975L30.8965 18.8517L32.5202 19.0222L34.4965 0.174071L32.8728 0.00357975Z"
                    fill="currentColor"
                  />
                  <path
                    d="M28.1449 -0.000147429L26.4749 0.175507L28.4545 19.0233L30.1246 18.8477L28.1449 -0.000147429Z"
                    fill="currentColor"
                  />
                  <path
                    d="M21.8968 1.14808L20.2554 1.68179L26.1077 19.7059L27.7492 19.1722L21.8968 1.14808Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16.0546 3.5446L14.4387 4.47818L23.908 20.8908L25.5239 19.9572L16.0546 3.5446Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10.839 7.08765L9.34839 8.43073L22.0208 22.5145L23.5114 21.1715L10.839 7.08765Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.44159 11.6521L5.20776 13.3514L20.5294 24.4909L21.7632 22.7916L6.44159 11.6521Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_54_1266">
                    <rect
                      width="61"
                      height="61"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className="md:w-[70%] max-w-[18.75rem] font-bold 2xl:text-2xl lg:text-xl text-lg text-center">
              Token-gated communities centred around NFT
            </span>
          </div>
          <div
            className={cx(
              'md:w-2/6 w-[70%] flex flex-col justify-center items-center gap-12 py-8',
              'md:border-r md:border-r-black border-r-0 md:border-b-0 border-b-black border-b'
            )}
          >
            <div className="h-[60px] w-[60px] animate-[step-spin_6s_ease-in-out_2s_infinite] animation-fill-forwards">
              <svg
                className="h-full w-full"
                width="60"
                height="64"
                viewBox="0 0 60 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_54_1281)">
                  <path
                    d="M60 33.5356C60 24.9492 58.4201 16.7883 55.5536 10.56C52.4196 3.75237 48.1328 0 43.4806 0H20.7445C12.2738 0 5.48589 12.3131 4.3846 28.799H0V29.5679C0 48.3759 7.2562 63.1034 16.5194 63.1034H39.2607C43.9129 63.1034 48.1997 59.3511 51.3337 52.5435C53.6701 47.4737 55.1471 41.1223 55.6205 34.3045H60.0051V33.5356H60ZM27.8875 50.2572C26.0451 45.6744 24.8615 40.1791 24.4498 34.3045H28.505V33.5356C28.505 25.9027 29.7813 18.6388 32.1125 12.8411C33.9549 17.4239 35.1385 22.9192 35.5502 28.7938H31.495V29.5628C31.495 37.1957 30.2187 44.4595 27.8875 50.2572ZM20.7445 1.53786C20.9915 1.53786 21.2334 1.55324 21.4804 1.57887C21.5627 1.58912 21.6399 1.6045 21.7223 1.61988C21.887 1.64551 22.0516 1.66601 22.2112 1.7019C22.3089 1.7224 22.4016 1.75316 22.4942 1.77879C22.6434 1.8198 22.7875 1.85056 22.9368 1.90182C23.0397 1.93258 23.1375 1.97871 23.2404 2.01459C23.3794 2.06586 23.5183 2.11712 23.6573 2.17863C23.7602 2.22477 23.8631 2.28116 23.966 2.33242C24.0998 2.39906 24.2336 2.46057 24.3674 2.53234C24.4755 2.58873 24.5784 2.66049 24.6814 2.72201C24.81 2.7989 24.9387 2.87579 25.0725 2.95781C25.1805 3.02958 25.2835 3.10647 25.3915 3.18337C25.5151 3.27564 25.6437 3.36278 25.7672 3.45505C25.8753 3.53707 25.9782 3.62935 26.0811 3.71649C26.2046 3.81901 26.3282 3.91641 26.4465 4.02406C26.5546 4.11633 26.6575 4.22398 26.7604 4.32138C26.8788 4.43416 26.9972 4.54693 27.1155 4.66484C27.2185 4.77249 27.3214 4.88526 27.4295 4.99804C27.5427 5.12107 27.661 5.2441 27.7743 5.37738C27.8772 5.49528 27.9801 5.62343 28.083 5.75159C28.1962 5.88487 28.3043 6.01815 28.4124 6.16168C28.5153 6.29497 28.6131 6.43337 28.716 6.57178C28.8241 6.71531 28.9322 6.85885 29.0351 7.01263C29.138 7.15617 29.2358 7.30995 29.3336 7.45861C29.4365 7.6124 29.5394 7.76618 29.6372 7.9251C29.735 8.08401 29.8327 8.24805 29.9305 8.40696C30.0283 8.571 30.1261 8.72991 30.2239 8.89907C30.3216 9.06824 30.4143 9.24253 30.5069 9.41682C30.5995 9.58598 30.6922 9.76027 30.7848 9.93456C30.8774 10.1191 30.9701 10.3036 31.0627 10.4933C31.1245 10.6266 31.1914 10.7548 31.2531 10.888C28.5668 16.8857 27.0486 24.6109 26.9611 32.7666H24.352C24.3005 31.7106 24.2748 30.6393 24.2748 29.5679V28.799H5.93361C7.00918 13.3947 13.2413 1.53786 20.7445 1.53786ZM49.9288 51.9027C47.1035 58.0439 43.213 61.5656 39.2607 61.5656C39.0136 61.5656 38.7718 61.5502 38.5247 61.5246C38.4424 61.5143 38.3652 61.4989 38.2829 61.4836C38.1182 61.4579 37.9535 61.4374 37.7888 61.4015C37.6962 61.381 37.5984 61.3503 37.5058 61.3247C37.3565 61.2836 37.2125 61.2529 37.0632 61.2016C36.9603 61.1709 36.8625 61.1247 36.7596 61.0889C36.6206 61.0376 36.4817 60.9863 36.3427 60.9248C36.2398 60.8787 36.1369 60.8223 36.034 60.7762C35.9002 60.7095 35.7612 60.648 35.6274 60.5711C35.5245 60.5147 35.4216 60.4481 35.3186 60.3866C35.1848 60.3097 35.051 60.2328 34.9224 60.1456C34.8195 60.079 34.7165 59.997 34.6136 59.9252C34.4849 59.8329 34.3563 59.7458 34.2276 59.6433C34.1247 59.5612 34.0218 59.4741 33.924 59.3921C33.7953 59.2896 33.6718 59.187 33.5432 59.0743C33.4403 58.982 33.3425 58.8846 33.2396 58.7872C33.116 58.6693 32.9925 58.5565 32.869 58.4284C32.7712 58.3258 32.6683 58.2131 32.5705 58.1105C32.4522 57.9824 32.3287 57.8542 32.2103 57.7158C32.1125 57.603 32.0148 57.48 31.917 57.3621C31.8038 57.2237 31.6854 57.0853 31.5722 56.9366C31.4744 56.8085 31.3766 56.6752 31.2788 56.547C31.1656 56.3984 31.0576 56.2497 30.9495 56.0908C30.8517 55.9524 30.7591 55.8037 30.6613 55.6602C30.5532 55.5013 30.4503 55.3424 30.3422 55.1783C30.2444 55.0246 30.1518 54.8708 30.0592 54.7119C29.9563 54.5427 29.8585 54.3787 29.7556 54.2044C29.6629 54.0403 29.5703 53.866 29.4777 53.6969C29.385 53.5226 29.2872 53.3483 29.1946 53.1689C29.102 52.9895 29.0093 52.8049 28.9219 52.6204C28.855 52.4871 28.7932 52.3538 28.7263 52.2205C31.4126 46.2229 32.9308 38.4977 33.0183 30.3419H35.6274C35.6789 31.3979 35.7046 32.4693 35.7046 33.5407V34.3096H54.0509C53.5878 40.9019 52.1623 47.0277 49.9134 51.9078L49.9288 51.9027Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_54_1281">
                    <rect
                      width="60"
                      height="63.1034"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className="md:w-[70%] max-w-[18.75rem] font-bold 2xl:text-2xl lg:text-xl text-lg text-center">
              Dao tooling & community insights
            </span>
          </div>
          <div className="md:w-2/6 w-[70%] flex flex-col justify-center items-center gap-12 py-8">
            <div className="h-[60px] w-[60px] animate-[step-spin_6s_ease-in-out_4s_infinite] animation-fill-forwards">
              <ConnectIcon />
            </div>
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
              className={cx(
                '2xl:text-2xl lg:text-xl text-lg font-medium',
                '2xl:pr-16 lg:pr-12 md:pr-8 pr-0 mb-8',
                'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '0.5s' }}
            >
              A completely new way for communities to form and interact with each other. Centred around NFTs.
            </p>
            <div
              className={cx(
                'flex items-center gap-3',
                '2xl:text-2xl lg:text-xl text-lg font-bold',
                '2xl:mb-9 lg:mb-7 mb-6 2xl:pr-16 lg:pr-12 md:pr-8 pr-0',
                'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '0.75s' }}
            >
              <div className="h-5 w-5">
                <ConnectIcon />
              </div>
              Token gated communities around NFTs
            </div>
            <div
              className={cx(
                'flex items-center gap-3',
                '2xl:text-2xl lg:text-xl text-lg font-bold',
                '2xl:mb-9 lg:mb-7 mb-6 2xl:pr-16 lg:pr-12 md:pr-8 pr-0',
                'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '1s' }}
            >
              <div className="h-5 w-5">
                <ConnectIcon />
              </div>
              Useful tooling for community management
            </div>
            <div
              className={cx(
                'flex items-center gap-3',
                '2xl:text-2xl lg:text-xl text-lg font-bold',
                '2xl:mb-9 lg:mb-7 mb-6 2xl:pr-16 lg:pr-12 md:pr-8 pr-0',
                'translate-x-full animate-[fly-in-from-right_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '1.25s' }}
            >
              <div className="h-5 w-5">
                <ConnectIcon />
              </div>
              Discover interesting projects & people
            </div>
            <Button
              color="dark"
              radius="xl"
              variant="default"
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
              className={cx(
                '2xl:text-2xl lg:text-xl text-lg font-medium',
                '2xl:pl-24 lg:pl-16 md:pl-8 pl-0 mb-8',
                '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '0.5s' }}
            >
              Social enabled wallet extension to get started with your web3 journey.
            </p>
            <div
              className={cx(
                'flex items-center gap-3 font-bold',
                '2xl:mb-9 lg:mb-7 mb-6 2xl:text-2xl lg:text-xl text-lg 2xl:pl-24 lg:pl-16 md:pl-8 pl-0',
                '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '0.75s' }}
            >
              <div className="h-5 w-5">
                <ConnectIcon />
              </div>
              Unified web2 and web3 profile
            </div>
            <div
              className={cx(
                'flex items-center gap-3 font-bold',
                '2xl:mb-9 lg:mb-7 mb-6 2xl:text-2xl lg:text-xl text-lg 2xl:pl-24 lg:pl-16 md:pl-8 pl-0',
                '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '1s' }}
            >
              <div className="h-5 w-5">
                <ConnectIcon />
              </div>
              Manage NFT portfolio with ease
            </div>
            <div
              className={cx(
                'flex items-center gap-3 font-bold',
                '2xl:mb-9 lg:mb-7 mb-6 2xl:text-2xl lg:text-xl text-lg 2xl:pl-24 lg:pl-16 md:pl-8 pl-0',
                '-translate-x-full animate-[fly-in-from-left_1s_ease-in-out] animation-fill-forwards !animate-none'
              )}
              style={{ animationDelay: '1.25s' }}
            >
              <div className="h-5 w-5">
                <ConnectIcon />
              </div>
              Transactions directly to social accounts
            </div>
            <a
              className="2xl:pl-24 lg:pl-16 md:pl-8 pl-0"
              href="https://chrome.google.com/webstore/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi"
              rel="noreferrer"
              target="_blank"
            >
              <Button
                color="dark"
                radius="xl"
                variant="default"
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
              <div className={cx('flex flex-row items-center gap-20 h-full mx-10', colorScheme === 'dark' && 'invert')}>
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
            className={cx(
              'flex items-center gap-12 w-[22.5rem] -mb-3 text-5xl font-bold z-[1010] opacity-0 overflow-hidden',
              'animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards !animate-none'
            )}
            style={{ animationDelay: '1s' }}
          >
            <div className="h-16 w-16 rounded-full bg-[#fce2f9] md:ml-0 ml-4" />
            <span>Discover.</span>
          </div>
          <div
            className={cx(
              'flex items-center gap-12 w-[22.5rem] -mb-3 text-5xl font-bold z-[1010] opacity-0 overflow-hidden',
              'animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards !animate-none'
            )}
            style={{ animationDelay: '2s' }}
          >
            <div className="h-16 w-16 rounded-full bg-[#c481c1] md:ml-0 ml-4" />
            <span>Connect.</span>
          </div>
          <div
            className={cx(
              'flex items-center gap-12 w-[22.5rem] -mb-3 text-5xl font-bold z-[1010] opacity-0 overflow-hidden',
              'animate-[fade-in-from-bottom_1.5s_linear] animation-fill-forwards !animate-none'
            )}
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
              className="max-w-[35rem] flex grow items-center justify-center gap-4 px-10 py-4 border border-black transition-opacity hover:opacity-80"
              href="https://twitter.com/morphis_network"
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-twitter w-12 h-12 flex justify-center items-center shrink-0 text-xl text-white bg-black rounded-full" />
              <span className="2xl:text-2xl lg:text-xl text-lg font-black">Follow Us on Twitter</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-lg" />
            </a>
            <a
              className="max-w-[35rem] flex grow items-center justify-center gap-4 px-10 py-4 border border-black transition-opacity hover:opacity-80"
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
      <Footer
        className="flex md:flex-row flex-col md:justify-between md:items-center items-start 2xl:px-14 lg:px-10 px-6 py-6 bg-black"
        fixed={false}
        height="auto"
        withBorder={false}
      >
        <Flex gap={rem(32)}>
          <Anchor
            className="transition-opacity hover:opacity-80"
            href="https://twitter.com/morphis_network"
            rel="noreferrer"
            target="_blank"
            underline={false}
          >
            <i className="fa-brands fa-twitter w-9 h-9 flex justify-center items-center text-lg text-white rounded-full" />
          </Anchor>
          <Anchor
            className="transition-opacity hover:opacity-80"
            href="http://discord.gg/morphis"
            rel="noreferrer"
            target="_blank"
            underline={false}
          >
            <i className="fa-brands fa-discord w-9 h-9 flex justify-center items-center text-lg text-white rounded-full" />
          </Anchor>
          <Anchor
            className="transition-opacity hover:opacity-80"
            href="https://medium.com/@morphis"
            rel="noreferrer"
            target="_blank"
            underline={false}
          >
            <i className="fa-brands fa-medium w-9 h-9 flex justify-center items-center text-lg text-white rounded-full" />
          </Anchor>
        </Flex>
        <Text
          color="dark.0"
          className="md:mt-0 mt-4"
        >
          © 2023 Morphis Network
        </Text>
      </Footer>
    </>
  )
}

export default Index
