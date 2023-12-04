import { useEffect, useState } from 'react'
import { useAddress, useChainId, useContract } from '@thirdweb-dev/react'
import { TbaUser } from '@/types'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { env } from 'env.mjs'
import { formatEther } from 'ethers/lib/utils'

const useTbaScrollerUser = (tokenId: number, isModalOpen?: boolean) => {
  const [tba, setTba] = useState<TbaUser>({
    isActive: false,
    lastBridge: 0,
    gasPref: 0,
    address: '',
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  const chainId = useChainId()
  const address = useAddress()
  const { contract } = useContract(chainId ? env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS : null, abi)

  useEffect(() => {
    const getTbaInfo = async () => {
      if (!contract || !address) return
      const [tbaOnChain, balance] = await contract.call('getTBA', [tokenId])

      const formattedTba: TbaUser = {
        isActive: tbaOnChain.active,
        lastBridge: tbaOnChain.lastBridge,
        gasPref: tbaOnChain.preference,
        address: tbaOnChain.tbaAddress,
        balance: +formatEther(balance),
      }

      setTba(formattedTba)
    }

    getTbaInfo()
      .catch(e => setError(e))
      .finally(() => setIsLoading(false))
  }, [tokenId, contract, address, isModalOpen])

  return { tba, isLoading, error }
}

export default useTbaScrollerUser
