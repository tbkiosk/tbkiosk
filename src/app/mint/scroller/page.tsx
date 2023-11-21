import NextImage from 'next/image'
import Link from 'next/link'
import { Image, Button } from '@nextui-org/react'
import { match } from 'ts-pattern'
import { Ethereum, Goerli, Polygon, Sepolia } from '@thirdweb-dev/chains'

import ConnectWalletButton from '@/components/connect_wallet_button'
import CopyButton from '@/components/copy_button'
import MintButton from './components/mint_button'
import MintedCount from './components/mint_count'
import DCAButton from './components/dca_button'
import MoreProjects from './components/more_projects'
import FAQ from './components/faq'

import LogoBlack from 'public/logo/logo-black.svg'
import LogoText from 'public/logo/logo-text.svg'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import PolygonCircle from 'public/icons/tokens/polygon-circle.svg'
import ChevronRight from 'public/icons/chevron-right.svg'

import { maskAddress } from '@/utils/address'

import { env } from 'env.mjs'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Kiosk - Mint Scroller Pass on ${
    {
      [Goerli.chainId]: Goerli.name,
      [Ethereum.chainId]: Ethereum.name,
      [Polygon.chainId]: Polygon.name,
      [Sepolia.chainId]: Sepolia.name,
    }[+env.NEXT_PUBLIC_CHAIN_ID_SCROLLER]
  }`,
}

const Mint = () => (
  <>
    <header className="h-[var(--header-height)] w-full fixed top-0 z-30 bg-white">
      <div className="h-full max-w-screen-2xl px-4 md:px-8 py-2 mx-auto flex items-center justify-between">
        <div className="w-auto md:w-[180px] flex gap-4 items-center text-white">
          <div className="w-[2.75rem] h-[2.75rem] text-white">
            <LogoBlack />
          </div>
          <div className="h-5 hidden md:block text-black">
            <LogoText />
          </div>
        </div>
        <div className="w-auto md:w-[180px] flex gap-4 items-center justify-end">
          <a
            href="/mint/scroller/settings"
            target="_blank"
          >
            <Button
              className="hidden md:flex font-medium border-black rounded-lg hover:bg-[#e1e1e1]"
              disableRipple
              variant="bordered"
            >
              📜 Manage Scrollers
            </Button>
          </a>
          <ConnectWalletButton />
        </div>
      </div>
    </header>
    <main className="h-[100vh] pt-[var(--header-height)] bg-white text-black overflow-hidden">
      <div className="h-full px-4 md:px-8 pt-16 pb-4 overflow-y-auto custom-scrollbar">
        <div className="max-w-screen-2xl mx-auto pb-4">
          <div className="p-8 md:p-20 bg-[#f5f5f5] rounded-[20px]">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <Image
                alt="beep"
                as={NextImage}
                classNames={{
                  wrapper: 'w-full max-w-[480px]',
                  img: 'aspect-square object-cover',
                }}
                height={480}
                loading="eager"
                priority
                src="/scroller/scroller.png"
                width={480}
              />
              <div className="flex flex-col grow-0">
                <div className="flex items-center gap-2 font-bold">
                  <span>Created by</span>
                  <span className="h-3 text-[#ed3733]">
                    <LogoText />
                  </span>
                </div>
                <p className="font-bold text-5xl leading-snug md:leading-normal">SCROLLER PASS</p>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6">
                    {match(env.NEXT_PUBLIC_CHAIN_ID_SCROLLER)
                      .with('1', () => <EthereumCircle />)
                      .with('5', () => <EthereumCircle />)
                      .with('137', () => <PolygonCircle />)
                      .with('11155111', () => <EthereumCircle />)
                      .exhaustive()}
                  </span>
                  <span>
                    {match(env.NEXT_PUBLIC_CHAIN_ID_SCROLLER)
                      .with('1', () => 'On Ethereum')
                      .with('5', () => 'On Goerli')
                      .with('137', () => 'On Polygon')
                      .with('11155111', () => 'On Sepolia')
                      .exhaustive()}
                  </span>
                </div>
                <div className="mt-8 font-medium text-sm">
                  <p className="mb-2">
                    Scroller Pass is an experimental NFT app that lets you bridge ETH from mainnet to Scroll L2 when gas fees are low. We
                    are currently in close beta, and only allowlisted addresses can mint. Join the Beep waitlist now and be first in line
                    for its public release. Don&apos;t miss out!
                  </p>
                  <p>
                    Join the&nbsp;
                    <a
                      className="underline"
                      href="https://tally.so/r/mKxWEX"
                      rel="noreferrer"
                      target="_blank"
                    >
                      waitlist
                    </a>
                    &nbsp;to be among the first to hear about the public release of Scroller Pass!
                  </p>
                </div>
                <div className="py-4 md:grow" />
                <p className="font-medium text-[#a6a9ae] leading-normal">Mint Price</p>
                <div className="flex items-center gap-4">
                  <span className="h-6 w-6">
                    <EthereumCircle />
                  </span>
                  <span className="font-medium text-3xl leading-normal">FREE</span>
                </div>
                <p className="font-medium text-[#a6a9ae] leading-normal">0.00 USD</p>
                <MintButton />
                <MintedCount />
              </div>
            </div>
            <hr className="my-16 border-black" />
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/2">
                <p className="font-bold text-3xl leading-normal">ABOUT SCROLLER PASS BOT</p>
                <div className="flex flex-wrap gap-2 mt-4 mb-12 overflow-hidden">
                  {['DeFi', 'SmartNFT', 'Bot'].map(_c => (
                    <span
                      className="max-w-full px-3 py-0.5 bg-black rounded text-sm text-white truncate"
                      key={_c}
                    >
                      {_c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Contract address</span>
                  {/* TODO ADD TYPES */}
                  <CopyButton copyText={env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS}>
                    {maskAddress(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS)}
                  </CopyButton>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Blockchain</span>
                  <span>
                    {match(env.NEXT_PUBLIC_CHAIN_ID_SCROLLER)
                      .with('1', () => 'Ethereum')
                      .with('5', () => 'Goerli')
                      .with('137', () => 'Polygon')
                      .with('11155111', () => 'Sepolia')
                      .exhaustive()}
                  </span>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Token standard</span>
                  <span>ERC-6551</span>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Supply</span>
                  <span>100</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="flex items-center gap-2 mb-4">
                  <Image
                    alt="beep"
                    as={NextImage}
                    height={24}
                    loading="eager"
                    src="data:image/jpeg;base64,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"
                    width={24}
                  />
                  <span className="font-medium">SCROLLER PASS</span>
                </div>
                <div className="mb-4 text-[#a6a9ae]">
                  <p className="mb-2">
                    Scroller Pass Bot is a game-changing Smart NFT that monitors gas fees, and bridges your ETH to the Scroll blockchain at
                    the most opportune moment .{' '}
                  </p>
                  <p className="mb-2">
                    No fuss, just mint Beep, set your gas tolerance and top up its balance whenever you want to bridge ETH to the Scroll L2.
                  </p>
                  <p className="mb-2">
                    Forget waking up at 4am to catch the lowest gas prices. Step into the future and maximize your wallet&apos;s potential
                    with your own Scroller Pass!
                  </p>
                </div>
                <a
                  className="flex items-center gap-2 mb-2"
                  href="/mint/scroller/settings"
                  target="_blank"
                >
                  <span>
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_4001_5931)">
                        <path
                          d="M2.00065 2.5H14.0007C14.1775 2.5 14.347 2.57024 14.4721 2.69526C14.5971 2.82029 14.6673 2.98986 14.6673 3.16667V13.8333C14.6673 14.0101 14.5971 14.1797 14.4721 14.3047C14.347 14.4298 14.1775 14.5 14.0007 14.5H2.00065C1.82384 14.5 1.65427 14.4298 1.52925 14.3047C1.40422 14.1797 1.33398 14.0101 1.33398 13.8333V3.16667C1.33398 2.98986 1.40422 2.82029 1.52925 2.69526C1.65427 2.57024 1.82384 2.5 2.00065 2.5ZM2.66732 3.83333V13.1667H13.334V3.83333H2.66732ZM8.00065 10.5H12.0007V11.8333H8.00065V10.5ZM5.77865 8.5L3.89265 6.61467L4.83598 5.67133L7.66398 8.5L4.83598 11.3287L3.89265 10.3853L5.77865 8.5Z"
                          fill="#09121F"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4001_5931">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="font-medium">Set up your Scroller Pass</span>
                  <span className="h-3 w-3">
                    <ChevronRight />
                  </span>
                </a>
                <a
                  className="flex items-center gap-2 mb-2"
                  href="/mint/scroller/settings"
                  target="_blank"
                >
                  <span>
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.00065 1.83398C11.6827 1.83398 14.6673 4.81865 14.6673 8.50065C14.6673 12.1827 11.6827 15.1673 8.00065 15.1673C4.31865 15.1673 1.33398 12.1827 1.33398 8.50065C1.33398 4.81865 4.31865 1.83398 8.00065 1.83398ZM8.00065 3.16732C6.58616 3.16732 5.22961 3.72922 4.22941 4.72941C3.22922 5.72961 2.66732 7.08616 2.66732 8.50065C2.66732 9.91514 3.22922 11.2717 4.22941 12.2719C5.22961 13.2721 6.58616 13.834 8.00065 13.834C9.41514 13.834 10.7717 13.2721 11.7719 12.2719C12.7721 11.2717 13.334 9.91514 13.334 8.50065C13.334 7.08616 12.7721 5.72961 11.7719 4.72941C10.7717 3.72922 9.41514 3.16732 8.00065 3.16732ZM8.00065 5.16732C8.70237 5.16758 9.38612 5.3893 9.95446 5.80088C10.5228 6.21246 10.9468 6.7929 11.166 7.45952C11.3851 8.12613 11.3883 8.84492 11.1751 9.51347C10.9619 10.182 10.5431 10.7662 9.9785 11.1829C9.41385 11.5995 8.73211 11.8273 8.03042 11.8338C7.32872 11.8404 6.64287 11.6253 6.07056 11.2192C5.49825 10.8132 5.06868 10.2369 4.84305 9.57241C4.61743 8.90795 4.60726 8.18923 4.81398 7.51865C4.96993 7.86713 5.24083 8.15147 5.58136 8.32409C5.92188 8.49672 6.31136 8.54715 6.68462 8.46696C7.05788 8.38676 7.39227 8.1808 7.63183 7.88354C7.8714 7.58628 8.0016 7.21576 8.00065 6.83398C8.00074 6.51296 7.90811 6.19875 7.73391 5.9291C7.55971 5.65946 7.31134 5.44586 7.01865 5.31398C7.32932 5.21865 7.65865 5.16732 8.00065 5.16732Z"
                        fill="#09121F"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">View minted Scroller Pass</span>
                  <span className="h-3 w-3">
                    <ChevronRight />
                  </span>
                </a>
                <DCAButton />
                <h1 className="mt-8 md:mt-24 mb-6 md:mb-12 font-medium text-3xl">Frequently Asked Questions</h1>
                <FAQ />
              </div>
            </div>
          </div>
          <h1 className="mt-20 mb-4 font-medium text-2xl">Discover More Projects</h1>
          <MoreProjects />
        </div>
        <footer className="md:h-[var(--header-height)] max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center font-medium">
          <div className="w-auto md:w-[180px] flex gap-4 items-center text-white">
            <div className="w-[2.75rem] h-[2.75rem] text-white">
              <LogoBlack />
            </div>
            <div className="h-5 block text-black">
              <LogoText />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 my-2 md:my-0 transition-colors">
            <a
              className="hover:text-[#6a6a6a]"
              href="https://twitter.com/tbkiosk"
              rel="noreferrer"
              target="_blank"
            >
              TWITTER
            </a>
            <a
              className="hover:text-[#6a6a6a]"
              href="mailto:info@tbkiosk.xyz"
            >
              SUPPORT
            </a>
            <Link
              className="hover:text-[#6a6a6a]"
              href="/projects"
            >
              MANAGE PROJECT
            </Link>
          </div>
          <span>@2023 Kiosk</span>
        </footer>
      </div>
    </main>
  </>
)

export default Mint
