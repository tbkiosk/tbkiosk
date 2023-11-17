'use client'

import { forwardRef } from 'react'
import { Select, SelectItem, Input, Checkbox, Button, type InputProps } from '@nextui-org/react'
import DatePicker from 'react-datepicker'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import ScrollCircle from 'public/icons/tokens/scroll-circle.svg'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import dayjs from 'dayjs'

import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'
import { FREQUENCY_OPTIONS } from '@/constants/beep'

import { TBA_USER_CONFIG_SCHEMA } from '@/types/schema'

import ArrowIcon from 'public/icons/arrow.svg'
import CalendarIcon from 'public/icons/calendar.svg'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

interface IBeepConfigProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3) => void
}

const SUGGESTED_DEPOSIT_MULTIPLIER = 10

const BeepConfig = ({ control, watch, setValue, trigger, clearErrors, setStep }: IBeepConfigProps) => {
  const tokenAddressFrom = watch('tokenAddressFrom')
  const frequency = watch('frequency')
  const amount = watch('amount')
  const endDate = watch('endDate')

  // eslint-disable-next-line
  const EndDateInput = forwardRef<HTMLInputElement>(({ value, onClick }: InputProps, ref) => (
    <Input
      classNames={{
        base: 'h-[48px] pl-8',
        label: 'hidden',
        innerWrapper: 'bg-transparent',
        input: 'pt-0 bg-transparent font-bold text-lg',
        inputWrapper: '!bg-transparent shadow-none',
      }}
      disabled={!endDate}
      endContent={
        <div className="h-3 w-3 self-center">
          <CalendarIcon />
        </div>
      }
      label="End date"
      onClick={onClick}
      ref={ref}
      value={value ? dayjs(value).format('DD MMM YYYY') : 'Forever'}
    />
  ))

  const onSubmit = async () => {
    const isValid = await trigger()

    if (isValid) {
      setValue(
        'depositAmount',
        !endDate ? amount * SUGGESTED_DEPOSIT_MULTIPLIER : Math.floor(dayjs(endDate).diff(dayjs()) / (frequency * 86400000) + 1) * amount
      )
      setStep(2)
    }
  }

  return (
    <div className="flex flex-col gap-10 font-medium">
      {/* intro */}
      <div className="flex items-center">
        <p>Tell us how much gas you would like to spend on the bridging, we will take care of the rest</p>
      </div>

      {/* icons */}
      <div className="flex justify-center items-center gap-2">
        <div className="w-10">
          <EthereumCircle />
        </div>
        <div>Ethereum</div>
        <div className="w-3">
          <ArrowIcon />
        </div>
        <div className="w-12 rounded-full border border-black border-opacity-20">
          <ScrollCircle />
        </div>
        <div>Scroll</div>
      </div>

      <div className="text-xl leading-[4rem]">
        <p>
          Current gas price: {200} GWEI (<span className="text-red-500">{'High'}</span>)
        </p>
        <p>I would like my gas fee tolerance to be:</p>
      </div>
      <div className="flex justify-between gap-6 text-center">
        <div className="bg-gray-100 rounded-md w-1/3 text-sm p-8">
          <p className="text-base font-bold pb-2 text-xl">LOW</p>
          <p>
            ${5}-{10}
          </p>
          <p>Execute within {48} hours</p>
        </div>
        <div className="bg-gray-100 rounded-md w-1/3 text-sm p-8">
          <p className="text-base font-bold pb-2 text-xl">MED</p>
          <p>
            ${10}-{30}
          </p>
          <p>Execute within {24} hours</p>
        </div>
        <div className="bg-gray-100 rounded-md w-1/3 text-sm p-8">
          <p className="text-base font-bold pb-2 text-xl">HIGH</p>
          <p>
            ${30}-{50}
          </p>
          <p>Execute within {1} hours</p>
        </div>
      </div>
      <div className="text-xs">
        <div className="flex justify-between gap-6">
          <div className="bg-gray-100 rounded-md p-2 px-6 w-2/3">
            <p className="text-xs">Deposit amount</p>
            <p className="text-right text-base">0.0000</p>
          </div>
          <div className="flex gap-6 items-center bg-gray-100 rounded-md flex-1 p-2">
            <div className="w-6">
              <EthereumCircle />
            </div>
            <div>
              <p>ETH</p>
              <p>Ethereum</p>
            </div>
          </div>
        </div>
        <div>Leave this blank to deposit after mint</div>
      </div>

      <div>
        <div>Investment amount per cycle</div>
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => (
            <Input
              classNames={{
                base: 'w-full md:w-[320px]',
                innerWrapper: '!items-center bg-transparent',
                input: 'w-full md:w-[180px] pt-0 bg-transparent font-bold text-4xl',
                inputWrapper: '!bg-transparent shadow-none',
                label: 'hidden',
              }}
              color={fieldState.error ? 'danger' : 'default'}
              endContent={TOKENS_FROM[tokenAddressFrom].name}
              errorMessage={fieldState.error?.message}
              label="Amount Per Period"
              onValueChange={value => {
                if (/(^[0-9]+$|^$)/.test(value)) {
                  field.onChange(+value)
                  clearErrors('amount')
                }
              }}
              value={String(field.value)}
            />
          )}
        />
      </div>
      <Button
        className="h-14 w-full bg-black text-2xl text-white rounded-full"
        onClick={onSubmit}
      >
        Continue to review
      </Button>
    </div>
  )
}

export default BeepConfig
