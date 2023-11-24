'use client'

import { Spinner } from '@nextui-org/react'

// import ScrollerAccountNotCreated from './scroller_account_not_created'
import SettingsBoardScroller from './scroller_settings_board'

import { env } from 'env.mjs'
import { abi } from '@/utils/scrollerNft_abiEnumerable'

import { useEffect, useState } from 'react'
import { useAddress, useChainId, useContract } from '@thirdweb-dev/react'
import { formatEther } from 'viem'
import { BigNumber } from 'alchemy-sdk'

type TbaUser = {
  active: boolean
  lastBridge: BigNumber
  preference: string
  tbaAddress: string
}

const ScrollerSettingsPanel = ({ tbaAddress, tokenId }: { tbaAddress: string; tokenId: string }) => {
  const [loaded, setLoaded] = useState(false)
  const chainId = useChainId()
  const [tba, setTba] = useState<TbaUser>()

  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS : null, abi)

  useEffect(() => {
    const getTbaInfo = async () => {
      if (!contract || !tbaAddress) return
      const [_tba, _] = await contract.call('getTBA', [tokenId])
      setTba(_tba)
      setLoaded(true)
    }

    getTbaInfo()
  }, [tokenId, contract, tbaAddress])

  if (!loaded) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  // if (tbaUserError) {
  //   return <p>{(tbaUserError as Error)?.message || 'Failed to load profile'}</p>
  // }

  // if (!tba) {
  //   return (
  //     <ScrollerAccountNotCreated
  //       refetch={refetch}
  //       tbaAddress={tbaAddress}
  //     />
  //   )
  // }

  return (
    <div className="w-full flex">
      {tba && (
        <SettingsBoardScroller
          tbaUser={tba}
          tokenId={tokenId}
        />
      )}
    </div>
  )
}

export default ScrollerSettingsPanel
