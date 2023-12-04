'use client'

import { Spinner } from '@nextui-org/react'

// import ScrollerAccountNotCreated from './scroller_account_not_created'
import SettingsBoardScroller from './scroller_settings_board'

import { TbaUser } from '@/types'

const ScrollerSettingsPanel = ({
  tba,
  tokenId,
  isLoading,
  onOpenChange,
}: {
  tba: TbaUser
  tokenId: string
  isLoading: boolean
  onOpenChange: (isOpen: boolean) => void
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  // if (tbaUserError) {
  //   return <p>{(tbaUserError as Error)?.message || 'Failed to load profile'}</p>
  // }

  // if (!tba) {
  //   return (
  //     <ScrollerAccountNotCreated
  //       refetch={refetch}
  //       tbaAddress={tbaAddress}
  //     />
  //   )
  // }

  return (
    <div className="w-full flex">
      {tba && (
        <SettingsBoardScroller
          tba={tba}
          tokenId={tokenId}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  )
}

export default ScrollerSettingsPanel
