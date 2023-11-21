'use client'

import { useEffect, forwardRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, InputProps, Select, SelectItem } from '@nextui-org/react'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { FREQUENCY_OPTIONS } from '@/constants/beep'
import { TOKENS_FROM, TOKENS_TO, USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from '@/constants/token'

import { env } from 'env.mjs'

const schema = z.object({
  frequency: z.number().int().positive(),
  amount: z.number().int().min(20),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
})

export type PlanForm = z.infer<typeof schema>

interface IPlanModalProps {
  amount?: number
  frequncy?: number
  endDate?: string | null
  tokenAddressFrom?: string
  tokenAddressTo?: string
  isOpen: boolean
  onOpenChange: () => void
  onSubmit: (data: PlanForm) => unknown | Promise<unknown>
}

const PlanModal = ({
  amount: defaultAmount,
  frequncy: defaultFrequncy,
  endDate: defaultEndDate,
  tokenAddressFrom: defaultTokenAddressFrom,
  tokenAddressTo: defaultTokenAddressTo,
  isOpen,
  onOpenChange,
  onSubmit,
}: IPlanModalProps) => {
  const {
    control,
    setValue,
    clearErrors,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PlanForm>({
    defaultValues: {
      amount: defaultAmount ?? 20,
      frequency: defaultFrequncy ?? 7,
      endDate: defaultEndDate === null ? null : defaultEndDate || dayjs().add(8, 'days').toISOString(),
      tokenAddressFrom: defaultTokenAddressFrom || USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
      tokenAddressTo: defaultTokenAddressTo || WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    },
    resolver: zodResolver(schema),
  })

  // eslint-disable-next-line
  const EndDateInput = forwardRef<HTMLInputElement>(({ value, onClick }: InputProps, ref) => (
    <Input
      classNames={{
        base: 'px-4 rounded-full border border-[#808080]',
        clearButton: '!bottom-4',
        label: '!font-normal !text-white',
        innerWrapper: 'bg-transparent',
        input: 'bg-transparent font-bold !text-white text-lg text-end',
        inputWrapper: '!bg-transparent',
      }}
      isClearable
      label="End date"
      onClear={() => setValue('endDate', null)}
      onClick={onClick}
      ref={ref}
      value={value ? dayjs(value).format('MM/DD/YYYY') : 'N/A'}
    />
  ))

  const _onSubmit = async (data: PlanForm) => {
    await onSubmit(data)
  }

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: defaultAmount ?? 20,
        frequency: defaultFrequncy ?? 7,
        endDate: defaultEndDate === null ? null : defaultEndDate || dayjs().add(8, 'days').toISOString(),
        tokenAddressFrom: defaultTokenAddressFrom || USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
        tokenAddressTo: defaultTokenAddressTo || WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
      })
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalContent className="bg-black text-white">
        {() => (
          <>
            <ModalHeader className="justify-center font-bold text-2xl">Dollar Cost Averaging Plan</ModalHeader>
            <ModalBody className="px-8 pb-8">
              <form
                className="flex flex-col items-center"
                onSubmit={handleSubmit(_onSubmit)}
              >
                <div className="w-[320px] max-w-[320px] flex flex-col items-center gap-8">
                  <div className="flex items-center justify-center gap-2">
                    <span className="shrink-0 text-xs">Auto invest in</span>
                    <Controller
                      control={control}
                      name="tokenAddressTo"
                      render={({ field }) => (
                        <Select
                          classNames={{
                            base: '!mt-0 bg-[#292929] rounded-full',
                            label: 'hidden',
                            trigger: 'h-[44px] pl-4 pr-6 !bg-transparent !shadow-none',
                            value: 'shrink-0 font-bold text-lg !text-white text-right',
                          }}
                          items={Object.values(TOKENS_TO)}
                          label="Select token"
                          labelPlacement="outside"
                          onSelectionChange={keys => {
                            Array.from(keys)[0] && field.onChange(Array.from(keys)[0].toString())
                          }}
                          selectedKeys={[field.value]}
                          selectorIcon={<></>}
                          size="sm"
                          startContent={
                            <div className="h-6 w-6 shrink-0">{TOKENS_TO[field.value]?.beepIcon && TOKENS_TO[field.value].beepIcon()}</div>
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
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field, fieldState }) => (
                      <Input
                        classNames={{
                          base: 'pl-4 rounded-full border border-[#808080]',
                          label: '!font-normal !text-white',
                          innerWrapper: 'bg-transparent',
                          input: 'bg-transparent font-bold !text-white text-lg text-end',
                          inputWrapper: '!bg-transparent',
                        }}
                        color={fieldState.error ? 'danger' : 'default'}
                        endContent={
                          <Controller
                            control={control}
                            name="tokenAddressFrom"
                            render={({ field }) => (
                              <Select
                                classNames={{
                                  base: 'w-[120px] ml-2 bg-[#292929] rounded-full',
                                  label: 'hidden',
                                  trigger: 'h-[38px] pl-4 pr-6 !bg-transparent !shadow-none',
                                  value: 'shrink-0 font-bold text-lg !text-white text-right',
                                }}
                                items={Object.values(TOKENS_FROM)}
                                label="Select token"
                                labelPlacement="outside"
                                onSelectionChange={keys => {
                                  Array.from(keys)[0] && field.onChange(Array.from(keys)[0].toString())
                                }}
                                selectedKeys={[field.value]}
                                selectorIcon={<></>}
                                size="sm"
                                startContent={
                                  <div className="h-6 w-6 shrink-0">
                                    {TOKENS_FROM[field.value]?.beepIcon && TOKENS_FROM[field.value].beepIcon()}
                                  </div>
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
                            )}
                          />
                        }
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
                  <div className="w-full">
                    <p className="mb-4 text-xs text-left">Recurring Cycle</p>
                    <Controller
                      control={control}
                      name="frequency"
                      render={({ field }) => (
                        <div className="flex gap-1 no-wrap">
                          {FREQUENCY_OPTIONS.map(_option => (
                            <Button
                              className={clsx(
                                'bg-transparent font-bold text-white text-xs border border-[#808080] rounded-full',
                                +field.value === +_option.frequency && 'bg-[#10cb93] font-bold text-black border-none'
                              )}
                              key={_option.frequency}
                              onPress={() => setValue('frequency', +_option.frequency)}
                            >
                              {_option.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <div className="w-full [&>.react-datepicker-wrapper]:w-full rounded">
                        <DatePicker
                          customInput={<EndDateInput />}
                          minDate={dayjs().add(1, 'day').toDate()}
                          onChange={value => field.onChange(dayjs(value).toISOString())}
                          popperPlacement="top"
                          selected={field.value ? dayjs(field.value).toDate() : null}
                        />
                      </div>
                    )}
                  />
                  <Button
                    className="w-[200px] bg-white font-bold text-sm text-black tracking-wide rounded-full"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Save Plan
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PlanModal
