'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/spinner'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'

import BeepAccountNotCreated from './beep_account_not_created'
import PlanModal from './plan_modal'
import SettingsBoard from './settings_board'

import RobotSuccess from 'public/beep/robot-success.svg'

import type { Profile } from '@/types/profile'

const BeepDeployed = ({ tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const router = useRouter()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    data: profile,
    isFetching: isProfileLoading,
    error: profileError,
    refetch,
  } = useQuery<Profile | { status: number; message: string }>({
    enabled: !!tbaAddress,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['token-bound-account-profile'],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const profile = await res.json()

      return profile
    },
  })

  if (isProfileLoading) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <Spinner color="default" />
      </div>
    )
  }

  if (profileError) {
    return <p>{(profileError as Error)?.message || 'Failed to load profile'}</p>
  }

  if (!profile) return null

  if ('message' in profile && profile.message === 'USER_NOT_FOUND') {
    return (
      <BeepAccountNotCreated
        refetch={refetch}
        tbaAddress={tbaAddress}
      />
    )
  }

  if (!('user' in profile)) return null

  if (!profile.user.SETTINGS_COMPLETE) {
    return (
      <div className="flex flex-col items-center grow">
        <PlanModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSuccess={() => router.replace(`${location.pathname}?show-deposit-modal=true`)}
          refetch={refetch}
          tbaAddress={tbaAddress}
        />
        <div className="grow h-16 mb-4">
          <RobotSuccess />
        </div>
        <p className="mb-4">Your Beep does not have any plan yet</p>
        <Button
          className="bg-white font-bold text-sm text-black tracking-wide rounded-full transition-colors hover:bg-[#e1e1e1]"
          onClick={onOpen}
        >
          Create a plan now
        </Button>
      </div>
    )
  }

  return (
    <SettingsBoard
      profile={profile}
      refetch={refetch}
      tbaAddress={tbaAddress}
    />
  )
}

export default BeepDeployed
