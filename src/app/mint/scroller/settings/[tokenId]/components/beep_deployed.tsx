'use client'

import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/react'

import BeepAccountNotCreated from './beep_account_not_created'
import SettingsBoard from './settings_board'

import type { TBAUser } from '@prisma/client'

const BeepDeployed = ({ tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const {
    data: tbaUser,
    isFetching: tbaUserLoading,
    error: tbaUserError,
    refetch,
  } = useQuery<TBAUser | null>({
    enabled: !!tbaAddress,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-tbaUser', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const tbaUser: TBAUser | null = await res.json()

      return tbaUser
    },
  })

  if (tbaUserLoading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  if (tbaUserError) {
    return <p>{(tbaUserError as Error)?.message || 'Failed to load profile, try to refresh the page'}</p>
  }

  if (!tbaUser) {
    return (
      <BeepAccountNotCreated
        refetch={refetch}
        tbaAddress={tbaAddress}
      />
    )
  }

  return (
    <SettingsBoard
      tbaUser={tbaUser}
      refetch={refetch}
      tbaAddress={tbaAddress}
    />
  )
}

export default BeepDeployed
