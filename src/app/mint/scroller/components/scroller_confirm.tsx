'use client'

import NextImage from 'next/image'
import { Image, Button } from '@nextui-org/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useSigner, ThirdwebSDK, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { SCROLLER_USER_CONFIG_SCHEMA } from '@/types/schema'

import { env } from 'env.mjs'

import ArrowIcon from 'public/icons/arrow.svg'

import type { ThirdWebError } from '@/types'
import { abi } from '@/utils/scrollerNft_abiEnumerable'

type ConfigForm = z.infer<typeof SCROLLER_USER_CONFIG_SCHEMA>
interface IBeepConfirmProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3 | 4) => void
}

// const MAX_MINT_AMOUNT = 2

const BeepConfirm = ({ control, getValues, watch, handleSubmit, formState: { isSubmitting }, setStep }: IBeepConfirmProps) => {
  const { depositAmount, gasTolerance } = getValues()
  const address = useAddress()
  const signer = useSigner()
  const { contract: scrollerContract } = useContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)
  const { refetch } = useOwnedNFTs(scrollerContract, address)

  const mintAmount = watch('mintAmount')
  // const depositAmountMultiple = depositAmount * mintAmount

  const gasToleranceMap: any = {
    0: 'disabed.',
    1: 'Low',
    2: 'Medium',
    3: 'High',
  }
  const gasToleranceParamMap: any = {
    1: 'LOW',
    2: 'MED',
    3: 'HIGH',
  }
  const gasPriceMap: any = {
    0: '',
    1: '(est. $5-10)',
    2: '(est. $10-30)',
    3: '(est. $30-50)',
  }
  const tolerance = gasToleranceMap[gasTolerance]
  const price = gasPriceMap[gasTolerance]

  const onSubmit = async () => {
    if (!signer) {
      toast.error('Signer not defined')
      return
    }

    if (!scrollerContract) {
      toast.error('Failed to collect contract information')
      return
    }

    try {
      const sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN_ID_SCROLLER, {
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      })
      const nftContract = await sdk.getContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)

      const mintArgs = [address, env.NEXT_PUBLIC_CHAIN_ID_SCROLLER, gasToleranceParamMap[gasTolerance]]

      await nftContract.call('mint', mintArgs)

      // wait for NFTs re-collection
      const nftResponse = await refetch()
      const nfts = nftResponse.data
      const ownedNFTs = nfts?.map(nft => nft.metadata.id)
      const mintedNFTs = ownedNFTs?.slice(-1 * mintAmount)

      if (!mintedNFTs) {
        toast.warning(
          'Mint was successful but failed to create investment plan(s). You can manually create an investment plan in settings page '
        )
        setStep(4)
        return
      }

      setStep(4)
    } catch (error) {
      toast.error((error as ThirdWebError)?.reason || (error as Error)?.message || 'Failed to mint')
    }
  }

  return (
    <form
      className="flex flex-col items-center gap-10 font-medium"
      onSubmit={handleSubmit(onSubmit)}
    >
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
          src="/scroller/scroller.png"
          width={92}
        />
      </div>

      <p className="text-center text-xl">
        Bridge from Ethereum to Scroll when the gas fee is
        <span className={gasTolerance == 3 ? 'text-red-500' : 'text-blue-500'}> {tolerance}</span>
        <span> {price}</span>
      </p>

      <Controller
        control={control}
        name="mintAmount"
        render={({ field }) => (
          <>
            {/* <div className="flex items-center gap-4">
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
            </div> */}
            <div className="w-[90%]">
              <div className="mb-4">Summary</div>
              <div className="px-8">
                <div className="flex justify-between mb-4">
                  <div className="font-normal">Deposit amount</div>
                  <div>{depositAmount} ETH</div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="font-normal">Mint fee</div>
                  <div>0.00 ETH</div>
                </div>
                {/* <div className="flex justify-between mb-4">
                  <div className="font-normal">Total Amount</div>
                  <div>{depositAmountMultiple} ETH</div>
                </div> */}
              </div>
            </div>
            <div className="w-[90%] flex items-center gap-4">
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
          </>
        )}
      />
    </form>
  )
}

export default BeepConfirm
