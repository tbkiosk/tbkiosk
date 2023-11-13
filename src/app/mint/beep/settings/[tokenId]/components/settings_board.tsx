'use client'

import { useState } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { Switch, Spinner, useDisclosure } from '@nextui-org/react'
import dayjs from 'dayjs'

import PlanModal from './plan_modal'

import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import GearIcon from 'public/icons/gear.svg'

import type { TBAUser } from '@prisma/client'

const SettingsBoard = ({ tbaUser, refetch, tbaAddress }: { tbaAddress: string; refetch: () => Promise<unknown>; tbaUser: TBAUser }) => {
  const signer = useSigner()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  const onUpdateStatus = async () => {
    setIsAccountUpdating(true)

    try {
      await signer?.signMessage(
        JSON.stringify({
          address: tbaAddress,
          isActive: !tbaUser.is_active,
        })
      )

      const res = await fetch(`/api/beep/profile/${tbaAddress}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          address: tbaAddress,
          isActive: !tbaUser.is_active,
        }),
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response: TBAUser = await res.json()
      if (response) {
        if (response.is_active) {
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
        <div
          className="h-6 w-6 flex justify-center items-center bg-white text-black rounded-full cursor-pointer transition-colors hover:bg-[#e1e1e1]"
          onClick={onOpen}
        >
          <PlanModal
            amount={tbaUser.amount}
            endDate={tbaUser.end_date ? dayjs(tbaUser.end_date).toISOString() : null}
            frequncy={tbaUser.frequency}
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
              isSelected={tbaUser.is_active}
            >
              {tbaUser.is_active ? (
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
          <div className="font-bold text-lg truncate">{tbaUser.next_swap ? dayjs(tbaUser.next_swap).format('DD MMM YY') : '-'}</div>
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
