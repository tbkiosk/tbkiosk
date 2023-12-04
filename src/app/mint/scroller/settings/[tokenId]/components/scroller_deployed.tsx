'use client'

import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/react'

// import ScrollerAccountNotCreated from './scroller_account_not_created'
// import SettingsBoardScroller from './scroller_settings_board'

import type { TBAUser } from '@prisma/client'

const ScrollerDeployed = ({ tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const {
    data: tbaUser,
    isFetching: tbaUserLoading,
    error: tbaUserError,
  } = useQuery<TBAUser | null>({
    enabled: !!tbaAddress,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-tbaUser', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/scroller/profile/${tbaAddress}`)

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
      // <ScrollerAccountNotCreated
      //   refetch={refetch}
      //   tbaAddress={tbaAddress}
      // />
      <>SCROLLER DEPLOYED ACCOUNT NOT CREATED</>
    )
  }

  return (
    // <SettingsBoard
    //   tbaUser={tbaUser}
    //   refetch={refetch}
    //   tbaAddress={tbaAddress}
    // />
    <>SCROLLER DEPLOYED SETTINGS BOARD</>
  )
}

export default ScrollerDeployed
