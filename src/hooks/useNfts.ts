import { useState, useEffect } from 'react'
import { useWallet } from '@suiet/wallet-kit'

import { suiJsonRpcProvider } from '@/lib/sui'

import type { SuiObjectData } from '@mysten/sui.js'

const useNfts = () => {
  const { address = '' } = useWallet()

  const [nfts, setNfts] = useState<SuiObjectData[]>([])
  const [loading, setLoading] = useState(false)

  const init = async () => {
    setLoading(true)

    try {
      const res = await suiJsonRpcProvider.getOwnedObjects({
        owner: address,
        options: { showType: true, showDisplay: true },
      })
      const _nfts: SuiObjectData[] =
        res?.data
          ?.filter(({ data }) => typeof data === 'object' && 'display' in data && data.display)
          .map(({ data }) => data as SuiObjectData) || []

      setNfts(_nfts)
    } catch (error) {
      setNfts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!address) {
      return
    }

    init()
  }, [])

  return { nfts, loading }
}

export default useNfts
