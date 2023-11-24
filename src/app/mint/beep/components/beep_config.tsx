'use client'

import { forwardRef } from 'react'
import { Select, SelectItem, Input, Checkbox, Button, type InputProps } from '@nextui-org/react'
import DatePicker from 'react-datepicker'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import dayjs from 'dayjs'

import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'
import { FREQUENCY_OPTIONS } from '@/constants/beep'

import { TBA_USER_CONFIG_SCHEMA } from 'prisma/schema'

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
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full">
          <div className="mb-2">Deposit Asset</div>
          <Controller
            control={control}
            name="tokenAddressFrom"
            render={({ field }) => (
              <div className="flex items-center justify-center p-8 rounded bg-[#efefef]">
                <Select
                  classNames={{
                    base: '!mt-0',
                    label: 'hidden',
                    selectorIcon: 'top-0',
                    trigger: 'h-[44px] w-[full] p-0 !bg-transparent !shadow-none',
                    value: 'font-bold text-lg text-center',
                  }}
                  items={Object.values(TOKENS_FROM)}
                  label="Select token"
                  labelPlacement="outside"
                  onSelectionChange={keys => {
                    Array.from(keys)[0] && field.onChange(Array.from(keys)[0].toString())
                  }}
                  renderValue={items =>
                    items.map(
                      _item =>
                        _item.data && (
                          <div
                            className="text-left"
                            key={_item.data.name}
                          >
                            <div>{_item.data.name}</div>
                            <div className="font-medium text-[#808080]">{_item.data.fullName}</div>
                          </div>
                        )
                    )
                  }
                  selectedKeys={[field.value]}
                  size="sm"
                  startContent={<div className="h-6 w-6 shrink-0">{TOKENS_FROM[field.value].icon && TOKENS_FROM[field.value].icon()}</div>}
                >
                  {_token => (
                    <SelectItem
                      classNames={{ base: '' }}
                      key={_token.address}
                      value={_token.address}
                    >
                      {_token.name}
                    </SelectItem>
                  )}
                </Select>
              </div>
            )}
          />
        </div>
        <div className="h-8 w-8 flex items-center justify-center shrink-0 m-4 bg-[#d9d9d9] rounded-full rotate-90 md:rotate-0">
          <div className="w-3">
            <ArrowIcon />
          </div>
        </div>
        <div className="w-full">
          <div className="mb-2">Receiving Asset</div>
          <Controller
            control={control}
            name="tokenAddressTo"
            render={({ field }) => (
              <div className="flex items-center justify-center p-8 rounded bg-[#efefef]">
                <Select
                  classNames={{
                    base: '!mt-0',
                    label: 'hidden',
                    selectorIcon: 'top-0',
                    trigger: 'h-[44px] w-[full] p-0 !bg-transparent !shadow-none',
                    value: 'font-bold text-lg text-center',
                  }}
                  items={Object.values(TOKENS_TO)}
                  label="Select token"
                  labelPlacement="outside"
                  onSelectionChange={keys => {
                    Array.from(keys)[0] && field.onChange(Array.from(keys)[0].toString())
                  }}
                  renderValue={items =>
                    items.map(
                      _item =>
                        _item.data && (
                          <div
                            className="text-left"
                            key={_item.data.name}
                          >
                            <div>{_item.data.name}</div>
                            <div className="max-w-[154px] font-medium text-[#808080] truncate">{_item.data.fullName}</div>
                          </div>
                        )
                    )
                  }
                  selectedKeys={[field.value]}
                  size="sm"
                  startContent={
                    <div className="h-6 w-6 shrink-0 overflow-hidden">{TOKENS_TO[field.value].icon && TOKENS_TO[field.value].icon()}</div>
                  }
                >
                  {_token => (
                    <SelectItem
                      classNames={{ base: '' }}
                      key={_token.address}
                      value={_token.address}
                    >
                      {_token.name}
                    </SelectItem>
                  )}
                </Select>
              </div>
            )}
          />
        </div>
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
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <div className="mb-2">Investment Interval</div>
          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              <div className="flex items-center justify-center px-8 py-2 rounded bg-[#efefef]">
                <Select
                  classNames={{
                    base: '!mt-0',
                    label: 'hidden',
                    selectorIcon: '',
                    trigger: 'w-[full] p-0 !bg-transparent shadow-none',
                    value: 'font-bold text-lg',
                  }}
                  items={FREQUENCY_OPTIONS}
                  label="Select interval"
                  labelPlacement="outside"
                  onSelectionChange={keys => {
                    Array.from(keys)[0] && field.onChange(+(Array.from(keys)[0] as string))
                  }}
                  selectedKeys={[String(field.value)]}
                  size="sm"
                >
                  {_freq => (
                    <SelectItem
                      classNames={{ base: '' }}
                      key={_freq.frequency}
                      value={_freq.frequency}
                    >
                      {_freq.name}
                    </SelectItem>
                  )}
                </Select>
              </div>
            )}
          />
        </div>
        <div className="h-8 w-8 shrink-0 m-4" />
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span>End date</span>
            <Checkbox
              classNames={{
                label: 'text-[#808080]',
              }}
              color="default"
              isSelected={!endDate}
              onValueChange={value => setValue('endDate', !value ? dayjs().add(8, 'days').toISOString() : null)}
            >
              DCA Forever
            </Checkbox>
          </div>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <>
                <div className="w-full [&>.react-datepicker-wrapper]:w-full rounded bg-[#efefef]">
                  <DatePicker
                    customInput={<EndDateInput />}
                    minDate={dayjs().add(1, 'day').toDate()}
                    onChange={value => field.onChange(dayjs(value).toISOString())}
                    popperPlacement="top"
                    selected={field.value ? dayjs(field.value).toDate() : null}
                  />
                </div>
                <div className="flex justify-between flex-wrap">
                  <span className="text-[#808080]">Suggested Deposit</span>
                  <span>
                    {!endDate
                      ? amount * SUGGESTED_DEPOSIT_MULTIPLIER
                      : Math.floor(dayjs(field.value).diff(dayjs()) / (frequency * 86400 * 1000) + 1) * amount}{' '}
                    {TOKENS_FROM[tokenAddressFrom].name}
                  </span>
                </div>
              </>
            )}
          />
        </div>
      </div>
      <Button
        className="h-14 w-full bg-black text-2xl text-white rounded-full"
        onClick={onSubmit}
      >
        Proceed To Review
      </Button>
    </div>
  )
}

export default BeepConfig
