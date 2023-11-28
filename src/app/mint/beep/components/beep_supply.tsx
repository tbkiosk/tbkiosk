'use client'

import { useContract, useTotalCount } from '@thirdweb-dev/react'
import { Spinner } from '@nextui-org/react'

import { env } from 'env.mjs'

const BeepSupply = () => {
  const { contract } = useContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS)
  const { data: totalCount, isLoading } = useTotalCount(contract)

  if (isLoading) {
    return (
      <Spinner
        color="default"
        size="sm"
      />
    )
  }

  return <span>{totalCount ? totalCount.toString() : '-'}</span>
}

export default BeepSupply
