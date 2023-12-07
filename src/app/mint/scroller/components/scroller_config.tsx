'use client'

import { useEffect, useState } from 'react'
import { Alchemy, Network } from 'alchemy-sdk'
import { Input, Button, Spinner } from '@nextui-org/react'
import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import ScrollCircle from 'public/icons/tokens/scroll-circle.svg'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { ethers } from 'ethers'
import { z } from 'zod'

import { SCROLLER_USER_CONFIG_SCHEMA } from '@/types/schema'

import ArrowStraight from 'public/icons/arrow.svg'
import ArrowIcon from 'public/icons/arrow-short.svg'
import Image from 'next/image'

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

  const depositAmount = watch('depositAmount')

  const fetchGasPrice = async () => {
    const response = await alchemy.core.getGasPrice()

    const currectGasPrice = ethers.utils.formatUnits(response, 'gwei')

    setGasPrice(currectGasPrice)
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
      setValue('gasTolerance', 1)
      setStep(3)
    }
  }

  const [trendingDownward, setTrendingDownward] = useState<boolean>(true) // TODO: get from API

  return (
    <div className="flex flex-col gap-4 font-medium text-sm">
      {/* intro */}
      <div className="flex items-center">
        <p>Simply mint and deposit, and your Scroller Pass will make sure that you always save on gas when bridging to Scroll!</p>
      </div>

      {/* icons */}
      <div className="flex justify-center items-center gap-3">
        <div className="w-8">
          <EthereumCircle />
        </div>
        <div>Ethereum</div>
        <div className="w-4">
          <ArrowStraight />
        </div>
        <div className="w-9 rounded-full">
          <ScrollCircle />
        </div>
        <div>Scroll</div>
      </div>

      <div className="text-base flex flex-col gap-4 pt-2">
        <div className="flex justify-between">
          <p>Current Gas price:</p>
          <div>{gasPrice ? parseInt(gasPrice).toFixed() : <Spinner size="sm" />} GWEI</div>
        </div>
        <div className="flex justify-between">
          <p>Expected cost of bridging:</p>
          <div> {gasPrice ? (350000 * 1e-9 * parseInt(gasPrice)).toFixed(4) : <Spinner size="sm" />} ETH</div>
        </div>
        <div className="text-xs flex justify-between pb-3 opacity-60 leading-[0]">
          <p>This does not include the gas fee to mint your Scroller Pass NFT</p>
          <p> {gasPrice ? (350000 * 1e-9 * parseInt(gasPrice) * 2050).toFixed(2) : '...'} USD</p>
        </div>
        <div>
          <div className="bg-gradient-to-r from-[#53cfc1] to-[#6B50E9] rounded rounded-md flex gap-4 p-4 text-sm text-white">
            <Image
              src="/scroller/stars_white.svg"
              alt="stars"
              width={24}
              height={24}
            />
            <div>
              {trendingDownward ? (
                <div>
                  <div className="flex">
                    <p>Scroller Pass predicts gas is trending DOWNWARDS</p>
                    <div className="w-5 rotate-90">
                      <ArrowIcon />
                    </div>
                  </div>
                  <p className="text-[10px]">Your ETH will be bridged at an optimal moment (typically within 12 hours).</p>
                </div>
              ) : (
                <div>
                  <div className="flex">
                    <p>Scroller Pass predicts gas is trending UPWARDS</p>
                    <div className="w-5">
                      <ArrowIcon />
                    </div>
                  </div>
                  <p className="text-[10px]">Scroller will bridge your ETH immediately after minting.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs">
        <div className="flex justify-between gap-3">
          <div className="bg-white rounded-md pt-4 px-6 w-2/3">
            <p className="text-xs opacity-50">Deposit amount</p>
            <Controller
              control={control}
              name="depositAmount"
              render={({ field, fieldState }) => (
                <Input
                  classNames={{
                    base: 'w-full',
                    innerWrapper: '!items-center bg-transparent',
                    input: 'w-full bg-transparent font-bold text-base text-right',
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
          <div className="flex gap-3 items-center bg-white rounded-md flex-1 px-6">
            <div className="w-8">
              <EthereumCircle />
            </div>
            <div>
              <p className="text-base">ETH</p>
              <p className="opacity-50">Ethereum</p>
            </div>
          </div>
        </div>
        <p className="pt-3 opacity-60">Leave blank to mint Scroller Pass but deposit funds later.</p>
      </div>

      <Button
        className="h-14 w-full bg-black text-2xl text-white rounded-full mt-8"
        onClick={onSubmit}
      >
        Continue to review
      </Button>
    </div>
  )
}

export default ScrollerConfig
