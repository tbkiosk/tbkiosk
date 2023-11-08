'use client'

import NextImage from 'next/image'
import { Image, Button } from '@nextui-org/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import clsx from 'clsx'

import { TOKENS_FROM } from '@/constants/token'

import { TBA_USER_CONFIG_SCHEMA } from '@/types/schema'

import ArrowIcon from 'public/icons/arrow.svg'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

interface IBeepConfirmProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3) => void
}

const MAX_MINT_AMOUNT = 5

const BeepConfirm = ({ control, getValues, setStep }: IBeepConfirmProps) => {
  const { depositAmount, tokenAddressFrom } = getValues()

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
                    {depositAmount} {TOKENS_FROM[tokenAddressFrom].name}
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="font-normal">Mint fee</div>
                  <div>0.00</div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="font-normal">Total</div>
                  <div>
                    {depositAmount} {TOKENS_FROM[tokenAddressFrom].name}
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

export default BeepConfirm
