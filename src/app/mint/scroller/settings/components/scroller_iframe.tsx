'use client'

import { useEffect, useState } from 'react'
import { useAddress, useChainId, useContract } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'
import clsx from 'clsx'

import { env } from 'env.mjs'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { tempSvg } from './base64Scroller'
import { formatEther } from 'viem'
import { gasInfoMap } from '@/constants/scroller/scroller'
import Image from 'next/image'

const ScrollerIframe = ({ tokenId }: { tokenId: string | number }) => {
  const [loaded, setLoaded] = useState(false)
  const [svgString, setSvgString] = useState<string>('')
  const [tbaBalance, setTbaBalance] = useState<string>('')
  const [tba, setTba] = useState<any>({})
  const address = useAddress()
  const chainId = useChainId()
  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS : null, abi)

  useEffect(() => {
    const getTbaInfo = async () => {
      if (!contract || !address) return

      // const baseUri = await contract.call('baseUri') // TODO
      // const svg = `data:image/svg+xml;base64,${baseUri}`

      const [tba, balance] = await contract.call('getTBA', [tokenId])

      setTba(tba)
      setTbaBalance(formatEther(balance).toString())
      setSvgString(tempSvg)
      setLoaded(true)
    }

    getTbaInfo()
  }, [tokenId, contract, address])

  if (!chainId) return null

  return (
    <div className="h-full w-full relative">
      {!loaded && (
        <div className="h-full w-full absolute flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}
      <div className={clsx('!h-full !w-full border-none rounded-[4%] opacity-0 cursor-pointer', loaded && 'opacity-100')}>
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
                <p>Status: {+tba?.preference == 0 ? 'OFF' : +tbaBalance ? 'PENDING' : 'RESTING'}</p>
                <p>Balance: {tbaBalance} ETH</p>
                <p>Gas Tolerance: {tba.preference ? gasInfoMap[+tba.preference].label : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen w-screen">
      {!loaded && (
        <div className="h-full w-full absolute flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}
      <div className={clsx('!h-full !w-full border-none rounded-[4%] opacity-0 cursor-pointer', loaded && 'opacity-100')}>
        <div className="relative max-w-screen bg-[#1b1b1b] mx-auto aspect-square max-h-screen overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-no-repeat bg-center bg-cover">
            <div className="w-full text-center">
              <div className="absolute top-4 w-full text-2xl font-[pixel]">
                <p>SCROLLER DCA #{tokenId}</p>
              </div>
              <div className="w-36 xs:w-[13rem] sm:w-[15rem] md:w-[20rem] lg:w-[20rem] p-2">
                <Image
                  src="/scroller/scroller_gif.gif"
                  alt="Beep Boop"
                  width={400}
                  height={400}
                />
              </div>
              <div className=" text-[9px] sm:text-sm lg:text-2xl">
                <div className="absolute bottom-4 w-full leading-[1]">
                  <p>Status: {+tba?.preference == 0 ? 'OFF' : +tbaBalance ? 'PENDING' : 'RESTING'}</p>
                  <p>Balance: {tbaBalance} ETH</p>
                  <p>Gas Tolerance: {tba.preference ? gasInfoMap[+tba.preference].label : ''}</p>
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
