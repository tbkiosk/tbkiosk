import { useState, useEffect } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import { COIN_TYPE_ARG_REGEX } from '@mysten/sui.js'

import { suiJsonRpcProvider } from '@/lib/sui'

import type {
  SuiObjectInfo,
  SuiObject,
  GetObjectDataResponse,
} from '@mysten/sui.js'

const useNfts = () => {
  const { address = '' } = useWallet()

  const [nfts, setNfts] = useState<SuiObject[]>([])
  const [loading, setLoading] = useState(false)

  const init = async () => {
    setLoading(true)

    try {
      const objectInfos: SuiObjectInfo[] =
        await suiJsonRpcProvider.getObjectsOwnedByAddress(address)
      const objectData: GetObjectDataResponse[] =
        await suiJsonRpcProvider.getObjectBatch(
          objectInfos
            .filter((obj) => !COIN_TYPE_ARG_REGEX.test(obj.type))
            .map((obj) => obj.objectId)
        )

      const existingObjects = objectData
        .filter((obj) => obj.status === 'Exists')
        .map((obj) => obj.details) as SuiObject[]

      setNfts(existingObjects)
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
