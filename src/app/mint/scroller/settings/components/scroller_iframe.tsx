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
          <div
            className="absolute inset-0 bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url("${tempSvg}")` }}
          >
            <div className="w-full text-center">
              <div className="absolute top-4 w-full">
                <p className="text-white text-2xl font-[pixel]">Scroller Pass #{tokenId}</p>
              </div>
              <div className="absolute bottom-4 w-full leading-[1]">
                <p className="text-white">Balance: {tbaBalance} ETH</p>
                <p className="text-white">Pref: {tba.preference ? gasInfoMap[tba.preference].label : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollerIframe
