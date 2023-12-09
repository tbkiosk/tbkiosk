'use client'

import { useChainId } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'
import clsx from 'clsx'
import Image from 'next/image'
import { gasInfoMap } from '@/constants/scroller/scroller'
import { TbaUser } from '@/types'
import BeepEth from 'public/icons/tokens/beep-eth.svg'

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
          {/* <div className="absolute inset-0 bg-[#1b1b1b]"> */}
          <div className="bg-cover h-full w-full relative bg-[#1A1A1A]">
            <div className="absolute inset-0 z-0 flex justify-center items-center">
              <div className={`w-[8rem] md:w-[10rem] p-2 ${tba.gasPref === 0 && 'grayscale opacity'}`}>
                <Image
                  src="/scroller/scroller_gif.gif"
                  alt="ScrollerPass"
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div
              className="w-full h-full p-3 sm:p-6 md:p-6 flex flex-col justify-between
              text-center sm:text-base md:text-sm"
            >
              <div className="w-full z-20 text-2xl sm:text-2xl md:text-3xl">
                <p className="font-[pixel]">Scroller Pass #{tokenId}</p>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col z-10 gap-2">
                  {/* status */}
                  <div
                    className="w-full flex justify-between gap-10 items-center
                    bg-white bg-opacity-10 p-1 px-3 rounded rounded-full"
                  >
                    <p className="font-[pixel]">Status</p>
                    <p className="font-[pixel]">{tba.gasPref === 0 ? 'OFF' : tba.balance ?? 0 ? 'PENDING' : 'RESTING'}</p>
                  </div>
                  {/* balance */}
                  <div
                    className="w-full flex justify-between center-items bg-white bg-opacity-10
                    p-1 px-3 rounded rounded-full"
                  >
                    <div className="flex gap-2">
                      <div className="w-4">
                        <BeepEth />
                      </div>
                      <p className="font-[pixel]">ETH</p>
                    </div>
                    <p className="font-[pixel]">{tba.balance.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollerIframe
