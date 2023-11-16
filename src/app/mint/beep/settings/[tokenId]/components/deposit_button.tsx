'use client'

import { useEffect } from 'react'
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, Button, Input, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useContract } from '@thirdweb-dev/react'
import { erc20ABI } from 'wagmi'
import { ethers } from 'ethers'
import { formatUnits } from 'viem'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'

import CopyButton from '@/components/copy_button'

import { maskAddress } from '@/utils/address'

import { TOKENS_FROM, USDC_CONTRACT_ADDRESS } from '@/constants/token'

import type { ThirdWebError } from '@/types'

import { env } from 'env.mjs'

const schema = z.object({
  token: z.string().startsWith('0x'),
  amount: z.string(),
})

type DepositForm = z.infer<typeof schema>

const defaultValues: DepositForm = {
  token: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  amount: '',
}

const DepositButton = ({ tbaAddress }: { tokenId: string; tbaAddress: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<DepositForm>({
    defaultValues,
    resolver: zodResolver(schema),
  })

  const tokenAddress = watch('token')

  const { contract } = useContract(tokenAddress, erc20ABI)

  const {
    data: balances,
    isLoading: balancesLoading,
    error,
  } = useQuery<{ [address: `0x${string}`]: string }>({
    queryKey: ['tba-balances', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/balances`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return await res.json()
    },
    enabled: isOpen,
    refetchInterval: 5000,
  })

  const onSubmit = async ({ amount, token }: DepositForm) => {
    if (+amount <= 0) {
      setError('amount', { type: 'custom', message: 'Invalid balance' })
      return
    }

    if (!contract) {
      toast.error('Failed to collect contract information')
      return
    }

    try {
      await contract.call('transfer', [tbaAddress, ethers.utils.parseUnits(String(amount), TOKENS_FROM[token].decimal)])

      toast.success(`Successfully deposited ${amount} ${TOKENS_FROM[token].name}`)
    } catch (error) {
      toast.error((error as ThirdWebError)?.reason || (error as Error)?.message || 'Failed to deposit')
    }
  }

  const renderBalance = (token: `0x${string}`) => {
    const tokenBalance = balances?.[token]

    if (tokenBalance === undefined) {
      return '-'
    }

    try {
      const tokenBalanceInBigInt = BigInt(tokenBalance)

      return formatUnits(tokenBalanceInBigInt, TOKENS_FROM[token].decimal)
    } catch (error) {
      return '-'
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
      <Button
        className="w-[172px] px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
        onPress={onOpen}
      >
        Deposit
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
      >
        <ModalContent className="bg-black text-white">
          {() => (
            <>
              <ModalHeader className="justify-center text-2xl">Deposit to your Beep account</ModalHeader>
              <ModalBody className="px-8 pb-8 tracking-wider">
                <form
                  className="flex flex-col items-center gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div>Your Beep wallet address</div>
                    <CopyButton
                      className="px-4 py-1 border border-[#a6a9ae] rounded-full font-normal text-sm text-[#a6a9ae] tracking-wider hover:border-[#666666]"
                      copyText={tbaAddress}
                    >
                      {maskAddress(tbaAddress)}
                    </CopyButton>
                  </div>
                  <div className="w-full flex flex-col items-center gap-2">
                    <Controller
                      control={control}
                      name="token"
                      render={({ field }) => (
                        <>
                          <Select
                            classNames={{
                              base: 'w-full max-w-[320px] border border-[#808080] rounded-full',
                              label: 'hidden',
                              popoverContent: 'bg-[#1f1f1f]',
                              trigger: 'h-[56px] bg-black hover:!bg-[#0f0f0f]',
                              value: 'font-bold text-lg text-center !text-white',
                            }}
                            items={Object.values(TOKENS_FROM)}
                            label="Select token"
                            labelPlacement="outside"
                            listboxProps={{
                              itemClasses: {
                                base: 'text-white',
                              },
                            }}
                            onSelectionChange={keys => {
                              Array.from(keys)[0] && field.onChange(Array.from(keys)[0].toString())
                            }}
                            radius="full"
                            renderValue={items => items.map(_item => _item.data && <div key={_item.data.name}>{_item.data.name}</div>)}
                            selectedKeys={[field.value]}
                            size="sm"
                            startContent={
                              <div className="h-6 w-6 shrink-0">{TOKENS_FROM[field.value].icon && TOKENS_FROM[field.value].icon()}</div>
                            }
                          >
                            {_token => (
                              <SelectItem
                                key={_token.address}
                                value={_token.address}
                              >
                                {_token.name}
                              </SelectItem>
                            )}
                          </Select>
                          <div className="text-center text-sm">
                            {balancesLoading ? (
                              <Spinner
                                color="default"
                                size="sm"
                              />
                            ) : (
                              `Balance: ${renderBalance(field.value as `0x${string}`)}`
                            )}
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field, fieldState }) => (
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
                          // errorMessage={fieldState.error?.message}
                          label="amount"
                          onValueChange={value => {
                            if (/^(\d+(\.\d*)?|\.\d+)?$/.test(value)) {
                              field.onChange(value)
                              clearErrors('amount')
                            }
                          }}
                          value={String(field.value)}
                        />
                      )}
                    />
                  </div>
                  <Button
                    className="h-12 w-full max-w-[320px] mt-8 px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Deposit to Beep
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DepositButton
