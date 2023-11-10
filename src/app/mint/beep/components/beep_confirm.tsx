'use client'

import { useState, useMemo } from 'react'
import NextImage from 'next/image'
import { Image, Button } from '@nextui-org/react'
import { Controller, type UseFormReturn, type UseFormGetValues } from 'react-hook-form'
import { useBalance, useSigner, Web3Button, ThirdwebSDK, useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { erc20ABI } from 'wagmi'
import { ethers } from 'ethers'
import { bytesToHex, numberToBytes } from 'viem'
import { toast } from 'react-toastify'
import { z } from 'zod'
import clsx from 'clsx'

import { TOKENS_FROM } from '@/constants/token'

import { TBA_USER_CONFIG_SCHEMA } from '@/types/schema'

import { env } from 'env.mjs'

import ArrowIcon from 'public/icons/arrow.svg'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

interface IBeepConfirmProps extends UseFormReturn<ConfigForm> {
  setStep: (value: 1 | 2 | 3 | 4) => void
}

const MAX_MINT_AMOUNT = 5

const BeepConfirm = ({ control, getValues, watch, setStep }: IBeepConfirmProps) => {
  const { depositAmount, tokenAddressFrom } = getValues()

  const [deployed, setDeployed] = useState(false)

  const signer = useSigner()
  const balance = useBalance(tokenAddressFrom)

  const mintAmount = watch('mintAmount')

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
                    {depositAmount * mintAmount} {TOKENS_FROM[tokenAddressFrom].name}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[90%] flex items-center gap-4">
              {!deployed && (
                <Button
                  className="h-12 w-12 min-w-12 shrink-0 p-0 bg-[#efefef] rounded-[10px]"
                  onClick={() => setStep(2)}
                >
                  <div className="w-3 rotate-180">
                    <ArrowIcon />
                  </div>
                </Button>
              )}
              {deployed ? (
                <CreateAccountsButton
                  getValues={getValues}
                  setStep={setStep}
                />
              ) : (
                <Web3Button
                  action={async contract => {
                    if (!balance.data) {
                      throw new Error('Failed to get balance')
                    }

                    const { depositAmount, amount } = getValues()
                    const totalDepositAmount = depositAmount * mintAmount

                    if (balance.data.value.div(10 ** balance.data.decimals).lt(totalDepositAmount)) {
                      throw new Error('Not enought balance')
                    }

                    if (!signer) {
                      throw new Error('Signer not defined')
                    }

                    if (totalDepositAmount > 0) {
                      await contract.call('approve', [
                        env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS,
                        ethers.utils.parseUnits(String(totalDepositAmount), TOKENS_FROM[tokenAddressFrom].decimal),
                      ])
                    }

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
                      tokenToTransfer: TOKENS_FROM[tokenAddressFrom].address,
                      /**Note: leave amountToTransfer as 0 if user doesn't want to deposit token before mint, it will still create tba but does not transfer any toke right after*/
                      amountToTransfer: ethers.utils.parseUnits(
                        totalDepositAmount <= 0 ? '0' : String(amount),
                        TOKENS_FROM[tokenAddressFrom].decimal
                      ),
                    }
                    await nftContract.call('claimAndCreateTba', [claimAndCreateArgs])

                    toast.success(`Successfully deposit and mint`)
                    setDeployed(true)
                  }}
                  contractAbi={erc20ABI}
                  contractAddress={TOKENS_FROM[tokenAddressFrom].address}
                  className="!h-14 !grow !bg-black !text-2xl !text-white !rounded-full [&>svg>circle]:!stroke-white"
                  onError={error => toast.error(error?.message || 'Failed to approve')}
                  theme="dark"
                >
                  Mint
                </Web3Button>
              )}
            </div>
          </>
        )}
      />
    </div>
  )
}

export default BeepConfirm

const CreateAccountsButton = ({
  getValues,
  setStep,
}: {
  getValues: UseFormGetValues<ConfigForm>
  setStep: (value: 1 | 2 | 3 | 4) => void
}) => {
  const { mintAmount, frequency, amount, tokenAddressFrom, tokenAddressTo, endDate } = getValues()

  const [creating, setCreating] = useState(false)

  const address = useAddress()
  const signer = useSigner()
  const { contract } = useContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS)
  const { data, isLoading } = useOwnedNFTs(contract, address)

  const ownedNFTs = useMemo(() => data?.map(nft => nft.metadata.id), [data])
  const mintedNFTs = ownedNFTs?.slice(-1 * mintAmount)

  const createAccounts = async () => {
    if (!mintedNFTs) return

    const tokenboundClient = new TokenboundClient({
      signer: signer,
      chainId: +env.NEXT_PUBLIC_CHAIN_ID,
      implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
      registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
    })

    const tokenIds = mintedNFTs.map(_nft =>
      tokenboundClient.getAccount({
        tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS as `0x${string}`,
        tokenId: _nft,
      })
    )

    try {
      setCreating(true)

      const res = await fetch(`/api/beep/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addresses: tokenIds,
          ownerAddress: address,
          frequency,
          amount,
          tokenAddressFrom,
          tokenAddressTo,
          endDate,
        }),
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      toast.success('Created account successfully')
      setStep(4)
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to create account')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Button
      className="h-14 w-full bg-black text-2xl text-white rounded-full"
      isLoading={isLoading || creating}
      onClick={() => createAccounts()}
    >
      Create DCA Accounts
    </Button>
  )
}
