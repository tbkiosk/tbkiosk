import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/react'
import { toast } from 'react-toastify'

const TotalInvestment = ({ tbaAddress, tokenAddress }: { tbaAddress: string; tokenAddress: string }) => {
  const { data, isFetching, error } = useQuery<number>({
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-total-investment', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/total-investment?token_address=${tokenAddress}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const investmentData: number = await res.json()

      return investmentData
    },
  })

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load total investment')
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

export default TotalInvestment
