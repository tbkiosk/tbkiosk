'use client'

import { Button, Input } from '@nextui-org/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useSigner, ThirdwebSDK, useAddress } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { SCROLLER_USER_CONFIG_SCHEMA } from '@/types/schema'

import ArrowIcon from 'public/icons/arrow.svg'

import type { ThirdWebError } from '@/types'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { parseEther } from 'viem'

type ConfigForm = z.infer<typeof SCROLLER_USER_CONFIG_SCHEMA>
interface IScrollerConfirmProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3 | 4) => void
}

const trimTrailingZeros = (num: number) => (+num.toFixed(10)).toString().replace(/(\.[0-9]*?)0*$/, '$1')

const ScrollerConfirm = ({
  control,
  getValues,
  watch,
  setValue,
  handleSubmit,
  formState: { isSubmitting },
  setStep,
}: IScrollerConfirmProps) => {
  const { depositAmount, gasTolerance } = getValues()
  const address = useAddress()
  const signer = useSigner()
  const email = watch('email')

  const displayError = (error: ThirdWebError | Error) => {
    const errorMessage = 'reason' in error ? error.reason : error.message || 'Failed to mint'
    toast.error(errorMessage)
  }

  const mintNFT = async () => {
    if (!signer) {
      toast.error('Signer not defined')
      return
    }

    const sdk = ThirdwebSDK.fromSigner(signer, process.env.NEXT_PUBLIC_CHAIN_ID_SCROLLER!, {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
    })
    const nftContract = await sdk.getContract(process.env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS!, abi as any)

    const mintArgs = [address, process.env.NEXT_PUBLIC_CHAIN_ID_SCROLLER, gasTolerance]
    const mintOptions: any = {
      value: parseEther(depositAmount),
      gasLimit: 500_000,
    }

    await nftContract.call('mint', mintArgs, mintOptions)
  }

  const onSubmit = async () => {
    setValue('email', email)

    try {
      await mintNFT()
      setStep(4)
    } catch (error) {
      if (error instanceof Error) {
        displayError(error)
      }
    }
  }

  return (
    <form
      className="flex flex-col justify-between items-center gap-6 font-medium mt-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center text-xl leading-[1.5]">
        {+depositAmount > 0 ? (
          <p className="">
            Your Scroller will bridge <span className="text-blue-500">{trimTrailingZeros(+depositAmount)} ETH</span> when the gas fee is
            optimal within <span className="text-blue-500">12 hours</span>.
          </p>
        ) : (
          <p className="text-center text-xl">You are not depositing any ETH. You can do this anytime in the settings page</p>
        )}
        <div className="text-sm text-left w-full pt-10">
          <p className=" pb-2">Get notified upon successful bridging!</p>
          <div className="rounded-md w-full">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  classNames={{
                    input: 'text-sm pl-4',
                  }}
                  type="email"
                  placeholder="Enter your email"
                  errorMessage={fieldState.error?.message}
                  onChange={e => field.onChange(e.target.value)}
                  value={field.value}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-4 mt-[10rem]">
        <Button
          className="h-12 w-12 min-w-12 shrink-0 p-0 bg-[#efefef] rounded-[10px]"
          disabled={isSubmitting}
          onClick={() => setStep(1)}
        >
          <div className="w-3 rotate-180">
            <ArrowIcon />
          </div>
        </Button>
        <Button
          className="h-14 w-full bg-black text-2xl text-white rounded-full"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
        >
          Mint
        </Button>
      </div>
    </form>
  )
}

export default ScrollerConfirm
