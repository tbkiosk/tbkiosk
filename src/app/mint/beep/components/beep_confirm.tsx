'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { Image, Button } from '@nextui-org/react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useSigner, ThirdwebSDK, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { erc20ABI } from 'wagmi'
import { ethers } from 'ethers'
import { bytesToHex, numberToBytes } from 'viem'
import { toast } from 'react-toastify'
import { z } from 'zod'
import clsx from 'clsx'

import { TOKENS_FROM } from '@/constants/token'

import { TBA_USER_CONFIG_SCHEMA } from 'prisma/schema'

import { env } from 'env.mjs'

import ArrowIcon from 'public/icons/arrow.svg'

import type { ThirdWebError } from '@/types'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

interface IBeepConfirmProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3 | 4) => void
}

const MAX_MINT_AMOUNT = 2

const BeepConfirm = ({ control, getValues, watch, handleSubmit, formState: { isSubmitting }, setStep }: IBeepConfirmProps) => {
  const { depositAmount, tokenAddressFrom, tokenAddressTo, amount, frequency, endDate } = getValues()

  const address = useAddress()
  const signer = useSigner()
  const { contract: tokenContract } = useContract(tokenAddressFrom, erc20ABI)
  const { contract: beepContract } = useContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS)
  const { refetch } = useOwnedNFTs(beepContract, address)

  const [progress, setProgress] = useState(0)

  const mintAmount = watch('mintAmount')

  const onSubmit = async () => {
    if (!signer) {
      toast.error('Signer not defined')
      return
    }

    if (!tokenContract || !beepContract) {
      toast.error('Failed to collect contract information')
      return
    }

    try {
      const totalDepositAmount = depositAmount * mintAmount
      setProgress(10)

      if (totalDepositAmount > 0) {
        await tokenContract.call('approve', [
          env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS,
          ethers.utils.parseUnits(String(totalDepositAmount), TOKENS_FROM[tokenAddressFrom].decimal),
        ])
      }

      setProgress(25)

      const sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN_ID, {
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      })
      const nftContract = await sdk.getContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS)
      const prepareTx = await nftContract.erc721.claim.prepare(mintAmount)
      const claimArgs = prepareTx.getArgs()
      const salt = bytesToHex(numberToBytes(0, { size: 32 }))
      const claimAndCreateArgs = {
        receiver: claimArgs[0],
        quantity: claimArgs[1],
        currency: claimArgs[2],
        pricePerToken: claimArgs[3],
        allowlistProof: claimArgs[4],
        data: claimArgs[5],
        registry: env.NEXT_PUBLIC_REGISTRY_ADDRESS,
        implementation: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS,
        salt: salt,
        chainId: env.NEXT_PUBLIC_CHAIN_ID,
        tokenToTransfer: tokenAddressFrom,
        // Note: leave amountToTransfer as 0 if user doesn't want to deposit token before mint, it will still create tba but does not transfer any toke right after
        amountToTransfer: ethers.utils.parseUnits(
          totalDepositAmount <= 0 ? '0' : String(depositAmount),
          TOKENS_FROM[tokenAddressFrom].decimal
        ),
      }

      setProgress(40)

      await nftContract.call('claimAndCreateTba', [claimAndCreateArgs])

      setProgress(60)

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

      setProgress(80)

      const tokenboundClient = new TokenboundClient({
        signer: signer,
        chainId: +env.NEXT_PUBLIC_CHAIN_ID,
        implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
        registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
      })

      const tokenAddresses = mintedNFTs.map(_nft =>
        tokenboundClient.getAccount({
          tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS as `0x${string}`,
          tokenId: _nft,
        })
      )

      setProgress(85)

      const res = await fetch(`/api/beep/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addresses: tokenAddresses,
          ownerAddress: address,
          frequency,
          amount,
          tokenAddressFrom,
          tokenAddressTo,
          endDate,
        }),
      })

      setProgress(95)

      if (!res.ok) {
        toast.warning(
          'Mint was successful but failed to create investment plan(s). You can manually create an investment plan in settings page'
        )
      } else {
        toast.success('Mint was successful')
      }

      setProgress(100)
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
                    {depositAmount * mintAmount} {TOKENS_FROM[tokenAddressFrom].name}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[90%] flex items-center gap-4">
              <Button
                className="h-12 w-12 min-w-12 shrink-0 p-0 bg-[#efefef] rounded-[10px]"
                disabled={isSubmitting}
                onClick={() => setStep(2)}
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
            {isSubmitting && (
              <div className="h-1 w-[90%] mb-4 relative bg-[#954e11] rounded-full">
                <div
                  className="h-full absolute top-0 flex items-center bg-[#f7b32e] rounded-full transition-[width]"
                  style={{ width: `${progress}%` }}
                />
                <div className="w-full absolute top-2 flex items-center">
                  <div className="w-1/4 text-center">Deposited</div>
                  <div className="w-1/4 text-center">Minted</div>
                  <div className="w-1/4 text-center">Deployed</div>
                  <div className="w-1/4 text-center">First DCA</div>
                </div>
              </div>
            )}
          </>
        )}
      />
    </form>
  )
}

export default BeepConfirm
