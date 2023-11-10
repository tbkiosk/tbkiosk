'use client'

import { useState } from 'react'
import { useChainId } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'
import clsx from 'clsx'

import { env } from 'env.mjs'

const BeepIframe = ({ tokenId }: { tokenId: string | number }) => {
  const chainId = useChainId()

  const [loaded, setLoaded] = useState(false)

  if (!chainId) return null

  return (
    <div className="h-full w-full relative">
      {!loaded && (
        <div className="h-full w-full absolute flex items-center justify-center">
          <Spinner color="default" />
        </div>
      )}
      <iframe
        className={clsx('!h-full !w-full border-none rounded-[4%] opacity-0 cursor-pointer', loaded && 'opacity-100')}
        onLoad={() => setLoaded(true)}
        src={`https://beep-iframe.vercel.app/${env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS}/${chainId}/${tokenId}`}
        style={{ colorScheme: 'normal' }}
      />
    </div>
  )
}

export default BeepIframe
