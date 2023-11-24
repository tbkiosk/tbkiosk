'use client'

import { Button, Tooltip, Chip, Input } from '@nextui-org/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useBalance } from '@thirdweb-dev/react'
import { z } from 'zod'
import dayjs from 'dayjs'

import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'
import { FREQUENCY_OPTIONS } from '@/constants/beep'

import { TBA_USER_CONFIG_SCHEMA } from 'prisma/schema'

import ArrowIcon from 'public/icons/arrow.svg'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

interface IBeepPreviewProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3) => void
}

const BeepPreview = ({ control, getValues, setValue, setStep, setError, clearErrors }: IBeepPreviewProps) => {
  const { frequency, amount, tokenAddressFrom, tokenAddressTo, endDate } = getValues()

  const balance = useBalance(tokenAddressFrom)

  const onSubmit = () => {
    const { depositAmount } = getValues()

    if (!balance.data) {
      setError('depositAmount', { type: 'custom', message: 'Failed to get balance' })
      return
    }

    if (balance.data.value.div(10 ** balance.data.decimals).lt(depositAmount)) {
      setError('depositAmount', { type: 'custom', message: 'Not enough balance' })
      return
    }

    setStep(3)
  }

  return (
    <div className="flex flex-col items-center gap-10 font-medium">
      <div className="w-[90%] font-bold text-2xl text-center">
        On a <span className="text-[#0062ff]">{FREQUENCY_OPTIONS.find(_freq => +_freq.frequency === +frequency)?.name}</span> basis, you
        will be swapping <span className="text-[#0062ff]">{amount}</span>{' '}
        <span className="text-[#0062ff]">{TOKENS_FROM[tokenAddressFrom].name}</span> to{' '}
        <span className="text-[#0062ff]">{TOKENS_TO[tokenAddressTo].name}</span>
        <span className="text-red-500">*</span>
      </div>
      <div className="flex items-center">
        <div className="text-center">
          <div className="font-normal">Start date</div>
          <div className="text-2xl">{dayjs().format('DD MMM YYYY')}</div>
        </div>
        <div className="h-8 w-8 flex justify-center items-center m-4">
          <div className="w-3">
            <ArrowIcon />
          </div>
        </div>
        <div className="text-center">
          <div className="font-normal">End date</div>
          <div className="text-2xl">{!endDate ? 'Forever' : dayjs(endDate).format('DD MMM YYYY')}</div>
        </div>
      </div>
      <div className="w-[90%]">
        <div className="flex items-center justify-center">
          Deposit Amount{' '}
          <Tooltip
            classNames={{
              content: 'before:bg-blue',
            }}
            content={<div className="w-[160px]">This amount will be stored in your Beep DCA bot. You can withdraw any time.</div>}
            placement="right"
          >
            <span className="h-4 w-4 flex items-center justify-center ml-2 bg-[#babdcc] rounded-full cursor-pointer">?</span>
          </Tooltip>
        </div>
        <div className="flex justify-center">
          <Controller
            control={control}
            name="depositAmount"
            render={({ field, fieldState }) => (
              <Input
                classNames={{
                  base: 'w-full md:w-[320px]',
                  innerWrapper: '!items-center bg-transparent',
                  input: 'w-full pt-0 bg-transparent font-bold text-4xl text-center',
                  inputWrapper: '!bg-transparent shadow-none',
                  label: 'hidden',
                }}
                color={fieldState.error ? 'danger' : 'default'}
                errorMessage={fieldState.error?.message}
                label="Deposit Amount"
                onValueChange={value => {
                  if (/(^[0-9]+$|^$)/.test(value)) {
                    field.onChange(+value > 1000000000 ? 999999999 : +value)
                    clearErrors('depositAmount')
                  }
                }}
                value={String(field.value)}
              />
            )}
          />
        </div>
        <div className="flex items-center justify-center flex-wrap md:gap-8">
          <div>
            <span className="mr-4 text-[#808080]">Balance:</span>
            <span>
              {TOKENS_FROM[tokenAddressFrom].name} {balance.data?.displayValue}
            </span>
          </div>
          <div className="flex gap-2">
            <Chip
              className="text-[#0062ff] cursor-pointer"
              onClick={() => {
                balance.data &&
                  setValue(
                    'depositAmount',
                    Math.floor(
                      balance.data.value
                        .div(4)
                        .div(10 ** balance.data.decimals)
                        .toNumber()
                    )
                  )
                clearErrors('depositAmount')
              }}
              size="sm"
            >
              25%
            </Chip>
            <Chip
              className="text-[#0062ff] cursor-pointer"
              onClick={() => {
                balance.data &&
                  setValue(
                    'depositAmount',
                    Math.floor(
                      balance.data.value
                        .div(2)
                        .div(10 ** balance.data.decimals)
                        .toNumber()
                    )
                  )
                clearErrors('depositAmount')
              }}
              size="sm"
            >
              50%
            </Chip>
            <Chip
              className="text-[#0062ff] cursor-pointer"
              onClick={() => {
                balance.data &&
                  setValue(
                    'depositAmount',
                    Math.floor(
                      balance.data.value
                        .mul(3)
                        .div(4)
                        .div(10 ** balance.data.decimals)
                        .toNumber()
                    )
                  )
                clearErrors('depositAmount')
              }}
              size="sm"
            >
              75%
            </Chip>
            <Chip
              className="text-[#0062ff] cursor-pointer"
              onClick={() => {
                balance.data && setValue('depositAmount', Math.floor(balance.data.value.div(10 ** balance.data.decimals).toNumber()))
                clearErrors('depositAmount')
              }}
              size="sm"
            >
              Max
            </Chip>
          </div>
        </div>
      </div>
      <div className="w-[90%] flex items-center gap-4">
        <Button
          className="h-12 w-12 min-w-12 shrink-0 p-0 bg-[#efefef] rounded-[10px]"
          onClick={() => setStep(1)}
        >
          <div className="w-3 rotate-180">
            <ArrowIcon />
          </div>
        </Button>
        <Button
          className="h-14 w-full bg-black text-2xl text-white rounded-full"
          onClick={onSubmit}
        >
          Proceed To Mint
        </Button>
      </div>
      <div className="text-red-500 text-sm -mt-8">* These settings can be changed from the settings page after you mint</div>
    </div>
  )
}

export default BeepPreview
