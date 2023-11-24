'use client'

import { useEffect, useState } from 'react'
import { useAddress, useChainId, useContract, useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Input, Spinner } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'

import { EXPLORER } from '@/constants/explorer'

import { env } from 'env.mjs'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { maskAddress } from '@/utils/address'
import { formatEther } from 'viem'

const schema = z.object({
  amount: z.string(),
  toAddress: z.string().startsWith('0x'),
})

type WithdrawForm = z.infer<typeof schema>

const defaultValues: WithdrawForm = {
  amount: '',
  toAddress: '',
}

const WithdrawButton = ({ tbaAddress, tokenId }: { tokenId: string; tbaAddress: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [tbaBalance, setTbaBalance] = useState<string>('')
  const [tbaOwner, setTbaOwner] = useState<string>('')

  const address = useAddress()
  const signer = useSigner()
  const chainId = useChainId()
  const { contract, isLoading, error } = useContract(chainId ? env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS : null, abi)

  useEffect(() => {
    const getTbaBalance = async () => {
      if (!contract || !address) return
      const response = await contract.call('getTBA', [tokenId])
      setTbaBalance(formatEther(response[1]))
    }

    const getTbaOwner = async () => {
      if (!contract || !address) return
      const owner = await contract.erc721.ownerOf(tokenId)
      setTbaOwner(owner)
    }

    getTbaBalance()
    getTbaOwner()
  }, [isOpen])

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<WithdrawForm>({
    defaultValues,
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: WithdrawForm) => {
    if (+data.amount > +tbaBalance) {
      setError('amount', { type: 'custom', message: 'Not enough ETH balance' })
      return
    }

    const tokenboundClient = new TokenboundClient({
      signer: signer,
      chainId: +env.NEXT_PUBLIC_CHAIN_ID_SCROLLER | 11155111,
      implementationAddress: env.NEXT_PUBLIC_SCROLLER_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
      registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS_SCROLLER as `0x${string}`,
    })

    try {
      const txHash = await tokenboundClient.transferETH({
        account: tbaAddress as `0x${string}`,
        amount: +data.amount,
        recipientAddress: data.toAddress as `0x${string}`,
      })

      toast.success(
        <p>
          Successfully transferred {data.amount} ETH at &nbsp;
          <a
            className="underline"
            href={`${EXPLORER[+env.NEXT_PUBLIC_CHAIN_ID_SCROLLER as 1 | 5 | 137 | 11155111]}/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            {txHash}
          </a>
        </p>
      )
      onOpenChange()
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to withdraw')
    }
  }

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load balances')
    }
  }, [error])

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues)
    }
  }, [isOpen])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
      >
        <ModalContent className="bg-black text-white">
          {() => (
            <>
              <ModalHeader className="justify-center font-bold text-2xl">Withdraw ETH from your Scroller Pass</ModalHeader>
              <ModalBody className="px-8 pb-8 tracking-wide">
                <form
                  className="flex flex-col items-center gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* WITHDRAW AMOUNT */}
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field, fieldState }) => (
                        <>
                          <div className="w-full flex flex-col items-center gap-2 mb-4">
                            <div className="flex justify-between items-center gap-4 text-center text-sm">
                              <div className="flex items-center gap-1">
                                <div>
                                  {isLoading ? (
                                    <Spinner
                                      color="default"
                                      size="sm"
                                    />
                                  ) : (
                                    `Balance:`
                                  )}
                                </div>
                                <button
                                  onClick={e => {
                                    e.preventDefault()
                                    field.onChange(tbaBalance)
                                  }}
                                  className="px-2 py-1 rounded-full bg-[#2B2B2B] text-#808080 tracking-wider transition-colors hover:bg-[#808080]"
                                >
                                  {tbaBalance} ETH
                                </button>
                              </div>
                            </div>
                          </div>
                          <Input
                            classNames={{
                              base: clsx('max-w-[320px] px-4 rounded-full border border-[#808080]', fieldState.error && 'border-red-500'),
                              label: clsx(
                                'font-normal text-white group-data-[has-value=true]:text-white',
                                fieldState.error && 'text-red-500 group-data-[has-value=true]:text-red-500'
                              ),
                              input: 'font-bold text-lg text-end group-data-[has-value=true]:text-white',
                              inputWrapper: '!bg-transparent',
                            }}
                            color={fieldState.error ? 'danger' : 'default'}
                            errorMessage={fieldState.error?.message}
                            label="amount"
                            onValueChange={value => {
                              if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
                                field.onChange(value)
                                clearErrors('amount')
                              }
                            }}
                            value={String(field.value)}
                          />
                        </>
                      )}
                    />
                  </div>
                  {/* TOKEN ADDRESS */}
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      control={control}
                      name="toAddress"
                      render={({ field, fieldState }) => (
                        <>
                          <div className="w-full flex flex-col items-center gap-2 mb-4">
                            <div className="flex justify-between items-center gap-4 text-center text-sm">
                              <div className="flex items-center gap-1">
                                <div>
                                  {isLoading ? (
                                    <Spinner
                                      color="default"
                                      size="sm"
                                    />
                                  ) : (
                                    `Owner: `
                                  )}
                                </div>
                                <button
                                  onClick={e => {
                                    e.preventDefault()
                                    field.onChange(tbaOwner)
                                  }}
                                  className="px-2 py-1 rounded-full bg-[#2B2B2B] text-#808080 tracking-wider transition-colors hover:bg-[#808080]"
                                >
                                  {maskAddress(tbaOwner)}
                                </button>
                              </div>
                            </div>
                          </div>
                          <Input
                            classNames={{
                              base: clsx('max-w-[320px] px-4 rounded-full border border-[#808080]', fieldState.error && 'border-red-500'),
                              label: clsx(
                                'font-normal text-white group-data-[has-value=true]:text-white',
                                fieldState.error && 'text-red-500 group-data-[has-value=true]:text-red-500'
                              ),
                              input: 'font-bold text-lg text-end group-data-[has-value=true]:text-white placeholder:text-[#7f7f7f]',
                              inputWrapper: '!bg-transparent',
                            }}
                            color={fieldState.error ? 'danger' : 'default'}
                            errorMessage={fieldState.error?.message}
                            label="toAddress"
                            onValueChange={value => {
                              field.onChange(value)
                              clearErrors('toAddress')
                            }}
                            value={field.value}
                          />
                        </>
                      )}
                    />
                  </div>
                  <Button
                    className="h-12 w-full max-w-[320px] mt-8 px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Confirm withdrawal
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        className="w-[172px] px-8 bg-transparent font-bold text-xl text-white border border-white rounded-full tracking-wider transition-colors hover:bg-[#0f0f0f]"
        onPress={onOpen}
      >
        Withdraw
      </Button>
    </>
  )
}

export default WithdrawButton
