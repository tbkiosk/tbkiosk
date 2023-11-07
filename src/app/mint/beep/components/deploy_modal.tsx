'use client'

import { useEffect, useState, forwardRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalProps, Select, SelectItem, Input, InputProps, Checkbox } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import { TBA_USER_SCHEMA } from '@/types/schema'

import { FREQUENCY_OPTIONS } from '../settings/[tokenId]/components/plan_modal'
import {
  USDT_CONTRACT_ADDRESS,
  USDT_DECIMAL,
  USDC_CONTRACT_ADDRESS,
  USDC_DECIMAL,
  WETH_CONTRACT_ADDRESS,
  WETH_DECIMAL,
  WSTETH_CONTRACT_ADDRESS,
  WSTETH_DECIMAL,
  // WBTC_CONTRACT_ADDRESS,
  // WBTC_DECIMAL,
  // UNI_CONTRACT_ADDRESS,
  // UNI_DECIMAL,
  // LINK_CONTRACT_ADDRESS,
  // LINK_DECIMAL,
} from '@/constants/token'

import { env } from 'env.mjs'

import ArrowIcon from 'public/icons/arrow.svg'
import USDC from 'public/icons/tokens/usdc.svg'
import USDT from 'public/icons/tokens/usdt.svg'
import Ethereum from 'public/icons/tokens/ethereum-circle.svg'
import STEthereum from 'public/icons/tokens/steth.svg'

type ConfigForm = z.infer<typeof TBA_USER_SCHEMA> & { mintAmount: number }

const defaultValues = {
  tokenAddressFrom: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  tokenAddressTo: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  amount: 60,
  frequency: 7,
  endDate: dayjs().add(7, 'days').toISOString(),
  mintAmount: 1,
}

const TOKENS_FROM = {
  [USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'USDC',
    fullName: 'USD Coin',
    address: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: USDC_DECIMAL,
    icon: () => <USDC />,
  },
  [USDT_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'USDT',
    fullName: 'Tether USD',
    address: USDT_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: USDT_DECIMAL,
    icon: () => <USDT />,
  },
}

const TOKENS_TO = {
  [WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'WETH',
    fullName: 'Wrapped Ethereum',
    address: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: WETH_DECIMAL,
    icon: () => <Ethereum />,
  },
  [WSTETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]]: {
    name: 'wstETH',
    fullName: "Lido's wrapped stETH",
    address: WSTETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    decimal: WSTETH_DECIMAL,
    icon: () => <STEthereum />,
  },
}

const DeployModal = ({ isOpen, onOpenChange }: Pick<ModalProps, 'isOpen' | 'onOpenChange'>) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [noEndDate, setNoEndDate] = useState(false)

  const { control, watch, handleSubmit, reset } = useForm<ConfigForm>({
    defaultValues,
    resolver: zodResolver(TBA_USER_SCHEMA),
  })

  const tokenFrom = watch('tokenAddressFrom')
  const frequency = watch('frequency')
  const amount = watch('amount')

  // eslint-disable-next-line
  const EndDateInput = forwardRef<HTMLInputElement>(({ value, onClick }: InputProps, ref) => (
    <Input
      classNames={{
        base: 'h-[48px] px-8',
        label: 'hidden',
        innerWrapper: 'bg-transparent',
        input: 'pt-0 bg-transparent font-bold text-lg',
        inputWrapper: '!bg-transparent shadow-none',
      }}
      disabled={noEndDate}
      label="End date"
      onClick={onClick}
      ref={ref}
      value={noEndDate ? 'No end date' : value ? dayjs(value).format('DD MMM YYYY') : ''}
    />
  ))

  const renderModalBody = () => {
    if (!isOpen) return null

    if (step === 1) {
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
                        base: '',
                        label: 'hidden',
                        popover: '',
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
                      startContent={
                        <div className="h-6 w-6 shrink-0">{TOKENS_FROM[field.value].icon && TOKENS_FROM[field.value].icon()}</div>
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
                        base: '',
                        label: 'hidden',
                        popover: '',
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
                        <div className="h-6 w-6 shrink-0 overflow-hidden">
                          {TOKENS_TO[field.value].icon && TOKENS_TO[field.value].icon()}
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
              render={({ field }) => (
                <Input
                  classNames={{
                    base: 'w-full md:w-[240px]',
                    label: 'hidden',
                    innerWrapper: 'bg-transparent',
                    input: 'pt-0 bg-transparent font-bold text-4xl',
                    inputWrapper: '!bg-transparent shadow-none',
                  }}
                  endContent={TOKENS_FROM[tokenFrom].name}
                  label="Amount Per Period"
                  onValueChange={value => /(^[0-9]+$|^$)/.test(value) && field.onChange(+value)}
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
                        base: '',
                        label: 'hidden',
                        popover: '',
                        selectorIcon: '',
                        trigger: 'w-[full] p-0 !bg-transparent shadow-none',
                        value: 'font-bold text-lg',
                      }}
                      items={FREQUENCY_OPTIONS}
                      label="Select interval"
                      labelPlacement="outside"
                      onSelectionChange={keys => {
                        Array.from(keys)[0] && +field.onChange(Array.from(keys)[0])
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
                  isSelected={noEndDate}
                  onValueChange={value => {
                    setNoEndDate(value)
                  }}
                >
                  No end date
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
                        disabled={noEndDate}
                        minDate={dayjs().add(1, 'day').toDate()}
                        onChange={value => field.onChange(dayjs(value).toISOString())}
                        popperPlacement="top"
                        selected={dayjs(field.value).toDate()}
                      />
                    </div>
                    <div className="flex justify-between wrap">
                      <span className="text-[#808080]">Investment total</span>
                      <span>
                        {noEndDate ? '∞' : Math.floor(dayjs(field.value).diff(dayjs()) / (frequency * 86400000) + 1) * amount}{' '}
                        {TOKENS_FROM[tokenFrom].name}
                      </span>
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      )
    }
  }

  const onSubmit = async (data: ConfigForm) => {
    // console.log(data)
  }

  useEffect(() => {
    setStep(1)

    if (isOpen) {
      reset(defaultValues)
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalContent>
        {() =>
          isOpen && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="justify-center">
                {match(step)
                  .with(1, () => 'Configure your Beep DCA')
                  .with(2, () => 'Review your Beep')
                  .with(3, () => 'Confirm')
                  .exhaustive()}
              </ModalHeader>
              <ModalBody className="px-8 pb-8">{renderModalBody()}</ModalBody>
            </form>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default DeployModal
