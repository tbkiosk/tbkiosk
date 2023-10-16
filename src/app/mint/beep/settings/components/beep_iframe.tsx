'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { useChainId } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/spinner'

import { BeepContractAddress } from '@/constants/beep'

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
        className={clsx('h-full w-full bg-black border-none rounded-xl opacity-0', loaded && 'opacity-100')}
        onLoad={() => setLoaded(true)}
        src={`https://beep-iframe.vercel.app/${BeepContractAddress[chainId]}/${chainId}/${tokenId}`}
        style={{ colorScheme: 'normal' }}
      />
    </div>
  )
}

export default BeepIframe
