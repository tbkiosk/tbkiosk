'use client'

import { useChainId } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'
import clsx from 'clsx'
import Image from 'next/image'
import { gasInfoMap } from '@/constants/scroller/scroller'
import { TbaUser } from '@/types'

const ScrollerIframe = ({ tba, isLoading, tokenId }: { tba: TbaUser; isLoading: boolean; tokenId: string | number }) => {
  const chainId = useChainId()

  if (!chainId) return null

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="h-full w-full absolute flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}
      <div className={clsx('!h-full !w-full border-none rounded-[4%] opacity-0 cursor-pointer', !isLoading && 'opacity-100')}>
        <div className="relative max-w-screen mx-auto aspect-square max-h-screen overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-[#1b1b1b] bg-center bg-cover">
            <div className="absolute inset-0 z-0 flex justify-center items-center">
              <div className="w-[8rem] md:w-[24rem] p-2">
                <Image
                  src="/scroller/scroller_gif.gif"
                  alt="ScrollerPass"
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="w-full h-full text-center p-3 flex flex-col justify-between">
              <div className="w-full z-20">
                <p className="text-white text-sm sm:text-lg md:text-4xl font-[pixel]">Scroller Pass #{tokenId}</p>
              </div>

              <div className="w-full z-10 leading-[1]">
                <p>Status: {tba.gasPref === 0 ? 'OFF' : tba.balance ?? 0 ? 'PENDING' : 'RESTING'}</p>
                <p>Balance: {tba.balance} ETH</p>
                <p>Gas Tolerance: {gasInfoMap[tba.gasPref].arg}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollerIframe
