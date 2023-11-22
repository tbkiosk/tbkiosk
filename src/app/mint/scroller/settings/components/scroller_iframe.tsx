'use client'

import { useEffect, useState } from 'react'
import { useAddress, useChainId, useContract } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'
import clsx from 'clsx'

import { env } from 'env.mjs'
import { abi } from '@/utils/scrollerNft_abiEnumerable'

const ScrollerIframe = ({ tokenId }: { tokenId: string | number }) => {
  const [loaded, setLoaded] = useState(false)
  const [svgString, setSvgString] = useState<string>('')
  const address = useAddress()
  const chainId = useChainId()
  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS : null, abi)

  useEffect(() => {
    const getSvgString = async () => {
      if (!contract || !address) return
      const response = await contract.call('baseUri')
      const svg = `data:image/svg+xml;base64,${response}`
      setSvgString(svg)
      setLoaded(true)
    }

    getSvgString()
  }, [tokenId, contract, address])

  if (!chainId) return null

  return (
    <div className="h-full w-full relative">
      {!loaded && (
        <div className="h-full w-full absolute flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}
      <div className={clsx('!h-full !w-full border-none rounded-[4%] opacity-0     cursor-pointer', loaded && 'opacity-100')}>
        <img
          src={svgString}
          alt="iframe"
        />
      </div>
    </div>
  )
}

export default ScrollerIframe
