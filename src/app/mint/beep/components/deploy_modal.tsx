'use client'

import { useEffect, useState, forwardRef } from 'react'
import NextImage from 'next/image'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalProps,
  Select,
  SelectItem,
  Input,
  InputProps,
  Checkbox,
  Button,
  Tooltip,
  Image,
  Chip,
} from '@nextui-org/react'
import { useBalance } from '@thirdweb-dev/react'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { TBA_USER_CONFIG_SCHEMA } from '@/types/schema'

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
import CalendarIcon from 'public/icons/calendar.svg'
import USDC from 'public/icons/tokens/usdc.svg'
import USDT from 'public/icons/tokens/usdt.svg'
import Ethereum from 'public/icons/tokens/ethereum-circle.svg'
import STEthereum from 'public/icons/tokens/steth.svg'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

const defaultValues = {
  tokenAddressFrom: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  tokenAddressTo: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  amount: 60,
  frequency: 7,
  endDate: dayjs().add(8, 'days').toISOString(),
  mintAmount: 1,
  depositAmount: 120,
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

const SUGGESTED_DEPOSIT_MULTIPLIER = 10
const MAX_MINT_AMOUNT = 5

const DeployModal = ({ isOpen, onOpenChange }: Pick<ModalProps, 'isOpen' | 'onOpenChange'>) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [noEndDate, setNoEndDate] = useState(false)

  const { control, watch, handleSubmit, reset, getValues, setValue, setError, formState } = useForm<ConfigForm>({
    defaultValues,
    resolver: zodResolver(TBA_USER_CONFIG_SCHEMA),
  })

  const tokenFrom = watch('tokenAddressFrom')
  const frequency = watch('frequency')
  const amount = watch('amount')

  const balance = useBalance(tokenFrom)

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
      disabled={noEndDate}
      endContent={
        <div className="h-3 w-3 self-center">
          <CalendarIcon />
        </div>
      }
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
                  endContent={TOKENS_FROM[tokenFrom].name}
                  errorMessage={fieldState.error?.message}
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
                    <div className="flex justify-between flex-wrap">
                      <span className="text-[#808080]">{noEndDate ? 'Suggested investment' : 'Investment total'}</span>
                      <span>
                        {noEndDate ? 'N/A' : Math.floor(dayjs(field.value).diff(dayjs()) / (frequency * 86400000) + 1) * amount}{' '}
                        {TOKENS_FROM[tokenFrom].name}
                      </span>
                    </div>
                  </>
                )}
              />
            </div>
          </div>
          <Button
            className="h-14 w-full bg-black text-2xl text-white rounded-full"
            type="submit"
          >
            Continue to review
          </Button>
        </div>
      )
    }

    if (step === 2) {
      const { frequency, amount, tokenAddressFrom, tokenAddressTo, endDate } = getValues()

      return (
        <div className="flex flex-col items-center gap-10 font-medium">
          <div className="w-[90%] font-bold text-2xl text-center">
            On a <span className="text-[#0062ff]">{FREQUENCY_OPTIONS.find(_freq => +_freq.frequency === +frequency)?.name}</span> basis, you
            will be swapping <span className="text-[#0062ff]">{amount}</span>{' '}
            <span className="text-[#0062ff]">{TOKENS_FROM[tokenAddressFrom].name}</span> to{' '}
            <span className="text-[#0062ff]">{TOKENS_TO[tokenAddressTo].name}</span>
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
              <div className="text-2xl">{noEndDate ? 'N/A' : dayjs(endDate).format('DD MMM YYYY')}</div>
            </div>
          </div>
          <div className="w-[90%]">
            <div className="flex items-center">
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
            <Controller
              control={control}
              name="depositAmount"
              render={({ field, fieldState }) => (
                <Input
                  classNames={{
                    base: 'w-full md:w-[320px]',
                    innerWrapper: '!items-center bg-transparent',
                    input: 'w-full pt-0 bg-transparent font-bold text-4xl text-left',
                    inputWrapper: '!bg-transparent shadow-none',
                    label: 'hidden',
                  }}
                  color={fieldState.error ? 'danger' : 'default'}
                  errorMessage={fieldState.error?.message}
                  label="Deposit Amount"
                  onValueChange={value => /(^[0-9]+$|^$)/.test(value) && field.onChange(+value)}
                  value={String(field.value)}
                />
              )}
            />
            <div className="w-[90%] flex items-center flex-wrap">
              <div>
                <span className="mr-4 text-[#808080]">Balance:</span>
                <span>
                  {TOKENS_FROM[tokenAddressFrom].name} {balance.data?.displayValue}
                </span>
              </div>
              <div className="flex gap-2 ml-8">
                <Chip
                  className="text-[#0062ff] cursor-pointer"
                  onClick={() =>
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
                  }
                  size="sm"
                >
                  25%
                </Chip>
                <Chip
                  className="text-[#0062ff] cursor-pointer"
                  onClick={() =>
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
                  }
                  size="sm"
                >
                  50%
                </Chip>
                <Chip
                  className="text-[#0062ff] cursor-pointer"
                  onClick={() =>
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
                  }
                  size="sm"
                >
                  75%
                </Chip>
                <Chip
                  className="text-[#0062ff] cursor-pointer"
                  onClick={() =>
                    balance.data && setValue('depositAmount', Math.floor(balance.data.value.div(10 ** balance.data.decimals).toNumber()))
                  }
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
              type="submit"
            >
              Mint
            </Button>
          </div>
        </div>
      )
    }

    if (step === 3) {
      const { depositAmount } = getValues()

      return (
        <div className="flex flex-col items-center gap-10 font-medium">
          <div>
            <Image
              alt="beep"
              as={NextImage}
              classNames={{
                wrapper: 'w-full max-w-[92px]',
                img: 'aspect-square object-cover',
              }}
              height={92}
              loading="eager"
              priority
              src="/beep/beep.png"
              width={92}
            />
          </div>
          <Controller
            control={control}
            name="mintAmount"
            render={({ field }) => (
              <>
                <div className="flex items-center gap-4">
                  <Button
                    className={clsx(
                      'h-12 w-12 min-w-12 bg-white text-black border border-black',
                      field.value <= 1 && '!bg-[#efefef] border-none'
                    )}
                    disabled={field.value <= 1}
                    onClick={() => field.onChange(field.value - 1)}
                  >
                    -
                  </Button>
                  <div className="px-16 py-6 text-2xl bg-[#efefef] rounded">{field.value}</div>
                  <Button
                    className={clsx(
                      'h-12 w-12 min-w-12 bg-white text-black border border-black',
                      field.value >= MAX_MINT_AMOUNT && '!bg-[#efefef] border-none'
                    )}
                    disabled={field.value >= MAX_MINT_AMOUNT}
                    onClick={() => field.onChange(field.value + 1)}
                  >
                    +
                  </Button>
                </div>
                <div className="w-[90%]">
                  <div className="mb-4">Summary</div>
                  <div className="px-8">
                    <div className="flex justify-between mb-4">
                      <div className="font-normal">Deposit amount</div>
                      <div>
                        {depositAmount} {TOKENS_FROM[tokenFrom].name}
                      </div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="font-normal">Mint fee</div>
                      <div>0.00</div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="font-normal">Total</div>
                      <div>
                        {depositAmount} {TOKENS_FROM[tokenFrom].name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[90%] flex items-center gap-4">
                  <Button
                    className="h-12 w-12 min-w-12 shrink-0 p-0 bg-[#efefef] rounded-[10px]"
                    onClick={() => setStep(2)}
                  >
                    <div className="w-3 rotate-180">
                      <ArrowIcon />
                    </div>
                  </Button>
                  <Button
                    className="h-14 w-full bg-black text-2xl text-white rounded-full"
                    type="submit"
                  >
                    Mint
                  </Button>
                </div>
              </>
            )}
          />
        </div>
      )
    }
  }

  const onSubmit = async (data: ConfigForm) => {
    if (step === 1) {
      const { frequency, amount, endDate } = getValues()
      setValue(
        'depositAmount',
        noEndDate ? amount * SUGGESTED_DEPOSIT_MULTIPLIER : Math.floor(dayjs(endDate).diff(dayjs()) / (frequency * 86400000) + 1) * amount
      )
      setStep(2)
      return
    }

    if (step === 2) {
      if (!balance.data) {
        setError('depositAmount', { type: 'custom', message: 'Failed to get balance' })
        return
      }

      if (balance.data.value.div(balance.data.decimals).lt(data.depositAmount)) {
        setError('depositAmount', { type: 'custom', message: 'Not enough balance' })
        return
      }

      setStep(3)
      return
    }
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
