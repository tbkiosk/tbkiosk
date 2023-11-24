'use client'

import { useState } from 'react'
import { useAddress } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { Switch, Spinner, useDisclosure } from '@nextui-org/react'
import dayjs from 'dayjs'

import PlanModal, { type PlanForm } from './plan_modal'
import TotalInvestment from './total_investment'
import PNL from './pnl'
import PenIcon from 'public/icons/pen.svg'

import { FREQUENCY_OPTIONS } from '@/constants/beep'
import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'

import type { TBAUser } from '@prisma/client'

const SettingsBoard = ({ tbaUser, refetch, tbaAddress }: { tbaAddress: string; refetch: () => Promise<unknown>; tbaUser: TBAUser }) => {
  const address = useAddress()

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  const onUpdateStatus = async () => {
    setIsAccountUpdating(true)

    try {
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

  const onSubmit = async ({ amount, frequency, tokenAddressFrom, tokenAddressTo, endDate }: PlanForm) => {
    const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerAddress: address,
        frequency,
        amount,
        tokenAddressFrom,
        tokenAddressTo,
        endDate,
      }),
    })

    if (!res.ok) {
      toast.error(res.statusText || 'Failed to create plan')
      return
    }

    toast.success('Investment plan updated')
    await refetch()
    onClose()
  }

  return (
    <div className="flex flex-col items-center grow px-8 py-4 bg-[#2b2b2b] rounded-[10px] shadow-md">
      <PlanModal
        amount={tbaUser.amount}
        frequncy={tbaUser.frequency}
        endDate={tbaUser.end_date ? dayjs(tbaUser.end_date).toISOString() : null}
        tokenAddressFrom={tbaUser.token_address_from}
        tokenAddressTo={tbaUser.token_address_to}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
      <div className="w-full flex items-center gap-4 mb-2">
        <div className="h-10 w-10 p-2 border border-white rounded-full">{TOKENS_TO[tbaUser.token_address_to]?.beepIcon()}</div>
        <div className="grow">
          <div className="font-bold text-lg leading-normal">{TOKENS_TO[tbaUser.token_address_to]?.name}</div>
          <div className="text-sm text-[#a6a9ae] tracking-wide leading-normal">
            Invest {tbaUser.amount || '-'} {TOKENS_FROM[tbaUser.token_address_from].name}&nbsp;
            {FREQUENCY_OPTIONS.find(_option => +_option.frequency === +tbaUser.frequency)?.name}
          </div>
        </div>
        <div
          className="flex justify-center items-center shrink-0 font-bold cursor-pointer"
          onClick={onOpen}
        >
          <div className="h-4 w-4 text-[#caff47]">
            <PenIcon />
          </div>
          Edit
        </div>
      </div>
      <hr className="w-full mb-6 border-white opacity-10" />
      <div className="w-full flex flex-col md:flex-row justify-between mb-8 tracking-wide">
        <div>
          <div className="text-sm text-[#a6a9ae] ">Total invested</div>
          <div className="font-bold text-[28px] truncate">
            <TotalInvestment
              tbaAddress={tbaAddress}
              tokenAddress={tbaUser.token_address_from}
            />
            <span className="ml-2">{TOKENS_FROM[tbaUser.token_address_from].name}</span>
          </div>
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
          <div className="font-bold text-lg text-start md:text-end">
            <PNL tbaAddress={tbaAddress} /> {TOKENS_FROM[tbaUser.token_address_from].name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsBoard
