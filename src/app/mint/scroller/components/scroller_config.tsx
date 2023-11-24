'use client'

import { useEffect, useState } from 'react'
import { Alchemy, Network } from 'alchemy-sdk'
import { Input, Button } from '@nextui-org/react'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import ScrollCircle from 'public/icons/tokens/scroll-circle.svg'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { ethers } from 'ethers'
import { z } from 'zod'

import { SCROLLER_USER_CONFIG_SCHEMA } from '@/types/schema'

import ArrowIcon from 'public/icons/arrow.svg'
import { gasInfoMap, getPriceLevel } from '@/constants/scroller'

type ConfigForm = z.infer<typeof SCROLLER_USER_CONFIG_SCHEMA>

interface IScrollerConfigProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3) => void
}

const config = {
  apiKey: 'sB96npElqKwCP0JpkITs_kf-owtYJ6iL', // todo: move to env
  network: Network.ETH_MAINNET,
}
const alchemy = new Alchemy(config)

const ScrollerConfig = ({ control, watch, setValue, trigger, clearErrors, setStep }: IScrollerConfigProps) => {
  const [gasPrice, setGasPrice] = useState<string | null>('')
  const [gasPriceLevel, setPriceLevel] = useState<string | null>('')

  const depositAmount = watch('depositAmount')
  const gasTolerance = watch('gasTolerance')

  const fetchGasPrice = async () => {
    const response = await alchemy.core.getGasPrice()

    const currectGasPrice = ethers.utils.formatUnits(response, 'gwei')
    const currentPriceLevel: string = getPriceLevel(parseInt(currectGasPrice))

    setGasPrice(currectGasPrice)
    setPriceLevel(currentPriceLevel)
  }

  useEffect(() => {
    fetchGasPrice()
    const intervalId = setInterval(fetchGasPrice, 60000)
    return () => clearInterval(intervalId)
  }, [])

  const onSubmit = async () => {
    const isValid = await trigger()

    if (isValid) {
      setValue('depositAmount', depositAmount)
      setValue('gasTolerance', gasTolerance)
      setStep(3)
    }
  }

  return (
    <div className="flex flex-col gap-6 font-medium">
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

      <div className="text-xl leading-[3rem]">
        <p>
          Current gas price: {gasPrice ? `${parseInt(gasPrice).toFixed()} Gwei ` : 'Loading..'}
          <span className="text-red-500">{gasPriceLevel ? `(${gasPriceLevel}) ` : ''}</span>
        </p>
        <p>I would like my gas fee tolerance to be:</p>
      </div>

      <Controller
        control={control}
        name="gasTolerance"
        render={({ field }) => (
          <div className="flex justify-between gap-6 text-center">
            <label
              className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                field.value === 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                value="1"
                checked={field.value === 1}
                onChange={() => field.onChange(1)}
                className="hidden"
              />
              <p className="text-base font-bold pb-2 text-xl">LOW</p>
              <p className="text-lg">
                ${gasInfoMap[1].price.from}-{gasInfoMap[1].price.to}
              </p>
              <p>Usually executes within 48 hours</p>
            </label>

            <label
              className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                field.value === 2 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                value="2"
                checked={field.value === 2}
                onChange={() => field.onChange(2)}
                className="hidden"
              />
              <p className="text-base font-bold pb-2 text-xl">MED</p>
              <p className="text-lg">
                ${gasInfoMap[2].price.from}-{gasInfoMap[2].price.to}{' '}
              </p>
              <p>Usually executes within 24 hours</p>
            </label>

            <label
              className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                field.value === 3 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                value="3"
                checked={field.value === 3}
                onChange={() => field.onChange(3)}
                className="hidden"
              />
              <p className="text-base font-bold pb-2 text-xl">HIGH</p>
              <p className="text-lg">
                ${gasInfoMap[3].price.from}-{gasInfoMap[3].price.to}{' '}
              </p>
              <p>Usually executes within 2 hours</p>
            </label>
          </div>
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
                    if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
                      field.onChange(value)
                      clearErrors('depositAmount')
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
        <p className="p-3">Leave blank to deposit funds later</p>
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
