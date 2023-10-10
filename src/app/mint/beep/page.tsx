import NextImage from 'next/image'
import { Image } from '@nextui-org/image'

import ConnectWalletButton from '@/components/connect_wallet_button'
import CopyButton from '@/components/copy_button'
import MintButton from './components/mint_button'
import MintedCount from './components/mint_count'
import DCAButton from './components/dca_button'
import MoreProjects from './components/more_projects'

import LogoBlack from 'public/logo/logo-black.svg'
import LogoText from 'public/logo/logo-text.svg'
import Ethereum from 'public/icons/tokens/ethereum.svg'
import EthereumCircleBlack from 'public/icons/tokens/ethereum-circle-black.svg'
import ChevronRight from 'public/icons/chevron-right.svg'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk - Mint Beep',
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
          <ConnectWalletButton />
        </div>
      </div>
    </header>
    <main className="h-[100vh] pt-[var(--header-height)] bg-white text-black overflow-hidden">
      <div className="h-full px-4 md:px-8 pt-16 pb-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-screen-2xl mx-auto">
          <div className="p-8 md:p-20 bg-[#f5f5f5] rounded-[20px]">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <Image
                alt="beep"
                as={NextImage}
                classNames={{
                  wrapper: 'max-w-[480px] grow',
                  img: 'aspect-square object-cover',
                }}
                height={480}
                loading="eager"
                priority
                src="/beep/beep.png"
                width={480}
              />
              <div className="flex flex-col grow">
                <div className="flex items-center gap-2 font-bold">
                  <span>Created by</span>
                  <span className="h-3 text-[#ed3733]">
                    <LogoText />
                  </span>
                </div>
                <p className="font-bold text-5xl leading-snug md:leading-normal">BEEP BOT</p>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6">
                    <Ethereum />
                  </span>
                  <span>On Testnet</span>
                </div>
                <p className="mt-8 font-medium text-sm">Beep is a DCA (Dollar Cost Averaging) bot with a token-bound account.</p>
                <div className="py-4 md:grow" />
                <p className="font-medium text-[#a6a9ae] leading-normal">Mint Price</p>
                <div className="flex items-center gap-4">
                  <span className="h-6 w-6">
                    <EthereumCircleBlack />
                  </span>
                  <span className="font-medium text-3xl leading-normal">0.00 ETH</span>
                </div>
                <p className="font-medium text-[#a6a9ae] leading-normal">0.00 USD</p>
                <MintButton />
                <MintedCount />
              </div>
            </div>
            <hr className="my-16 border-black" />
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/2">
                <p className="font-bold text-3xl leading-normal">ABOUT BEEP BOT</p>
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
                  <CopyButton copyText="0x86818Bf7d23FB9E588eFD5E927F6362E43244fa9">0x8681...4fa9</CopyButton>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Blockchain</span>
                  <span>Testnet</span>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Token standard</span>
                  <span>ERC-6551</span>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-12 my-4 font-medium">
                  <span className="md:min-w-[130px] inline-block text-[#a6a9ae]">Supply</span>
                  <span>1,000</span>
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
                  <span className="font-medium">BEEP BOT</span>
                </div>
                <p className="mb-4 text-[#a6a9ae]">
                  Beep is Dollar Cost Averaging (DCA) bot with a token-bound account. In a volatile market, Beep is your reliable companion,
                  helping you navigate fluctuations by strategically spreading your purchases across different price levels. Say goodbye to
                  emotional trading decisions and start accumulating with confidence.
                </p>
                <p className="mb-8 text-[#a6a9ae]">
                  Beep is a new take on what&apos;s possible with ERC 6551 smart NFTs. Brought to you by Kiosk.
                </p>
                <a
                  className="flex items-center gap-2 mb-2"
                  href="/mint/beep/settings"
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
                  <span className="font-medium">Set up your beep</span>
                  <span className="h-3 w-3">
                    <ChevronRight />
                  </span>
                </a>
                <a
                  className="flex items-center gap-2 mb-2"
                  href="/mint/beep/settings"
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
                  <span className="font-medium">View minted beeps</span>
                  <span className="h-3 w-3">
                    <ChevronRight />
                  </span>
                </a>
                <DCAButton />
              </div>
            </div>
          </div>
          <h1 className="mt-20 mb-4 font-medium text-2xl">Discover More Projects</h1>
          <MoreProjects />
        </div>
      </div>
    </main>
  </>
)

export default Mint
