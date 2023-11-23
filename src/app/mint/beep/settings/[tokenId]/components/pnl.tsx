'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/react'
import { toast } from 'react-toastify'

const PNL = ({ tbaAddress }: { tbaAddress: string }) => {
  const { data, isFetching, error } = useQuery<number>({
    enabled: !!tbaAddress,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-pnl', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/pnl`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const pnl: number = await res.json()

      return pnl
    },
  })

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load pnl')
    }
  }, [error])

  if (isFetching) {
    return (
      <Spinner
        color="default"
        size="sm"
      />
    )
  }

  return <span>{data ?? '-'}</span>
}

export default PNL
