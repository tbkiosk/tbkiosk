'use client'

import { useContract, useTotalCirculatingSupply } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'

import { env } from 'env.mjs'

const MintedCount = () => {
  const { contract } = useContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS)
  const { data, isLoading } = useTotalCirculatingSupply(contract)

  return (
    <div className="w-full flex items-center justify-center gap-2 mt-2 font-medium">
      {isLoading ? (
        <Spinner
          color="default"
          size="sm"
        />
      ) : (
        data?.toString() || '-'
      )}
      <span>minted</span>
    </div>
  )
}

export default MintedCount
