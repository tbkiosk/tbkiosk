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

const ScrollerConfig = ({ control, watch, setValue, trigger, clearErrors, setStep }: IBeepConfigProps) => {
  const depositAmount = watch('depositAmount')
  const gasTolerance = watch('gasTolerance')

  const onSubmit = async () => {
    const isValid = await trigger()

    if (isValid) {
      setValue('depositAmount', depositAmount)
      setValue('gasTolerance', gasTolerance)
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
      <div className="flex justify-center items-center gap-3">
        <div className="w-10">
          <EthereumCircle />
        </div>
        <div>Ethereum</div>
        <div className="w-6">
          <ArrowIcon />
        </div>
        <div className="w-11 rounded-full border border-black border-opacity-20">
          <ScrollCircle />
        </div>
        <div>Scroll</div>
      </div>

      {/* <div className="text-xl leading-[4rem]">
        <p>
          Current gas price: {200} GWEI (<span className="text-red-500">{'High'}</span>)
        </p>
        <p>I would like my gas fee tolerance to be:</p>
      </div>
      <div className="flex justify-between gap-6 text-center">
        <div className="bg-gray-100 rounded-md w-1/3 text-sm p-8 hover:bg-gray-200 cursor-pointer">
          <p className="text-base font-bold pb-2 text-xl">LOW</p>
          <p>
            ${5}-{10}
          </p>
          <p>Execute within {48} hours</p>
        </div>
        <div className="bg-gray-100 rounded-md w-1/3 text-sm p-8 hover:bg-gray-200 cursor-pointer">
          <p className="text-base font-bold pb-2 text-xl">MED</p>
          <p>
            ${10}-{30}
          </p>
          <p>Execute within {24} hours</p>
        </div>
        <div className="bg-gray-100 rounded-md w-1/3 text-sm p-8 hover:bg-gray-200 cursor-pointer">
          <p className="text-base font-bold pb-2 text-xl">HIGH</p>
          <p>
            ${30}-{50}
          </p>
          <p>Execute within {1} hours</p>
        </div>
      </div> */}

      <Controller
        control={control}
        name="gasFeeTolerance"
        render={({ field }) => (
          <>
            <div className="text-xl leading-[4rem]">
              <p>
                Current gas price: {200} GWEI (<span className="text-red-500">{'High'}</span>)
              </p>
              <p>I would like my gas fee tolerance to be:</p>
            </div>
            <div className="flex justify-between gap-6 text-center">
              {/* LOW Option */}
              <label
                className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                  field.value === '1' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  value="1"
                  checked={field.value === '1'}
                  onChange={() => field.onChange('1')}
                  className="hidden"
                />
                <p className="text-base font-bold pb-2 text-xl">LOW</p>
                <p>
                  ${5}-{10}
                </p>
                <p>Execute within 48 hours</p>
              </label>

              {/* MED Option */}
              <label
                className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                  field.value === '2' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  value="2"
                  checked={field.value === '2'}
                  onChange={() => field.onChange('2')}
                  className="hidden"
                />
                <p className="text-base font-bold pb-2 text-xl">MED</p>
                <p>
                  ${10}-{30}
                </p>
                <p>Execute within 24 hours</p>
              </label>

              {/* HIGH Option */}
              <label
                className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                  field.value === '3' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  value="3"
                  checked={field.value === '3'}
                  onChange={() => field.onChange('3')}
                  className="hidden"
                />
                <p className="text-base font-bold pb-2 text-xl">HIGH</p>
                <p>
                  ${30}-{50}
                </p>
                <p>Execute within 1 hours</p>
              </label>
            </div>
          </>
        )}
      />

      <div className="text-xs">
        <div className="flex justify-between gap-3">
          <div className="bg-gray-100 rounded-md p-4 px-6 w-2/3">
            <p className="text-xs opacity-50">Deposit amount</p>
            <Controller
              control={control}
              name="depositAmount"
              render={({ field, fieldState }) => (
                <Input
                  classNames={{
                    base: 'w-full',
                    innerWrapper: '!items-center bg-transparent',
                    input: 'w-full pt-0 bg-transparent font-bold text-3xl text-right',
                    inputWrapper: '!bg-transparent shadow-none',
                    label: 'hidden',
                  }}
                  color={fieldState.error ? 'danger' : 'default'}
                  errorMessage={fieldState.error?.message}
                  label="Deposit amount"
                  onValueChange={value => {
                    if (value === '' || /^\d*(\.\d{1,8})?$/.test(value)) {
                      field.onChange(value) // Pass the string value directly
                      clearErrors('amount')
                    }
                  }}
                  value={String(field.value)}
                />
              )}
            />
          </div>
          <div className="flex gap-3 items-center bg-gray-100 rounded-md flex-1 px-6">
            <div className="w-8">
              <EthereumCircle />
            </div>
            <div>
              <p className="text-lg">ETH</p>
              <p className="opacity-50">Ethereum</p>
            </div>
          </div>
        </div>
        <p className="py-3">Leave this blank to deposit after mint</p>
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

export default ScrollerConfig
