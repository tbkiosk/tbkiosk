'use client'

import { useContract, useTotalCirculatingSupply } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/spinner'

import { CONTRACT_ADDRESS } from '@/constants/beep'

const MintedCount = () => {
  const { contract } = useContract(CONTRACT_ADDRESS)
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
