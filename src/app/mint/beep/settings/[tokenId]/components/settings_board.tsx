'use client'

import { useState } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { Switch } from '@nextui-org/switch'
import { Spinner } from '@nextui-org/spinner'
import { useDisclosure } from '@nextui-org/modal'
import dayjs from 'dayjs'

import PlanModal, { FREQUENCY_OPTIONS } from './plan_modal'

import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import GearIcon from 'public/icons/gear.svg'

import type { Profile } from '@/types/profile'

const SettingsBoard = ({ profile, refetch, tbaAddress }: { tbaAddress: string; refetch: () => Promise<unknown>; profile: Profile }) => {
  const signer = useSigner()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  const onUpdateStatus = async () => {
    setIsAccountUpdating(true)

    try {
      await signer?.signMessage(
        JSON.stringify({
          ID: tbaAddress,
          IS_ACTIVE: !profile?.user.IS_ACTIVE,
        })
      )

      const res = await fetch(`/api/beep/profile/${tbaAddress}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          ID: tbaAddress,
          IS_ACTIVE: !profile?.user.IS_ACTIVE,
        }),
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response = await res.json()
      if (response?.user) {
        if (response.user.IS_ACTIVE) {
          toast.success('Your Beep is activated and the first transaction has been initiated')
        } else {
          toast.success('Your Beep is Deactivated')
        }

        refetch()
      }
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to update account')
    } finally {
      setIsAccountUpdating(false)
    }
  }

  return (
    <div className="flex flex-col items-center grow">
      <div className="w-full flex items-center gap-4 mb-2">
        <span className="h-10 w-10">
          <EthereumCircle />
        </span>
        <div className="grow">
          <div className="font-bold text-lg leading-normal">ETH</div>
          <div className="text-sm text-[#a6a9ae] tracking-wide leading-normal">
            Invest {profile.user.AMOUNT || '-'} USDC&nbsp;
            {FREQUENCY_OPTIONS.find(_option => +_option.frequency === +profile.user.FREQUENCY)?.name}
          </div>
        </div>
        <div
          className="h-6 w-6 flex justify-center items-center bg-white text-black rounded-full cursor-pointer transition-colors hover:bg-[#e1e1e1]"
          onClick={onOpen}
        >
          <PlanModal
            amount={String(profile.user.AMOUNT)}
            endDate={profile.user.END_DATE}
            frequncy={String(profile.user.FREQUENCY)}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            refetch={refetch}
            tbaAddress={tbaAddress}
          />
          <span className="h-4 w-4 rounded-full">
            <GearIcon />
          </span>
        </div>
      </div>
      <hr className="w-full mb-6 border-[#a6a9ae]" />
      <div className="w-full flex flex-col md:flex-row justify-between mb-8 tracking-wide">
        <div>
          <div className="text-sm text-[#a6a9ae] ">Total invested</div>
          <div className="font-bold text-[28px] truncate">- USDC</div>
        </div>
        <div>
          <div className="text-sm text-[#a6a9ae] text-start md:text-end">Status</div>
          <div className="h-[42px] flex items-center justify-start md:justify-end">
            <Switch
              color="success"
              isDisabled={isAccountUpdating}
              onValueChange={onUpdateStatus}
              thumbIcon={
                isAccountUpdating && (
                  <Spinner
                    classNames={{
                      wrapper: 'h-4 w-4',
                    }}
                    color="default"
                    size="sm"
                  />
                )
              }
              isSelected={profile.user.IS_ACTIVE}
            >
              {profile.user.IS_ACTIVE ? (
                <span className="font-bold text-sm text-[#07ea7d] tracking-wide">Active</span>
              ) : (
                <span className="font-bold text-sm text-[#a6a9ae] tracking-wide">Inactive</span>
              )}
            </Switch>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between tracking-wide">
        <div>
          <div className="text-sm text-[#a6a9ae] ">Next Auto-Invest Date</div>
          <div className="font-bold text-lg truncate">
            {profile.user.NEXT_UPDATE ? dayjs(profile.user.NEXT_UPDATE * 1000).format('DD MMM YY') : '-'}
          </div>
        </div>
        <div>
          <div className="text-sm text-[#a6a9ae] text-start md:text-end">Unrealised PnL</div>
          <div className="font-bold text-lg text-start md:text-end">- USDC</div>
        </div>
      </div>
    </div>
  )
}

export default SettingsBoard
