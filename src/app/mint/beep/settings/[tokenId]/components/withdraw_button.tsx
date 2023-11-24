'use client'

import { useEffect } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Select, SelectItem, Input, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { formatUnits } from 'viem'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'

import { EXPLORER } from '@/constants/explorer'
import { TOKENS_FROM, TOKENS_TO, USDC_CONTRACT_ADDRESS } from '@/constants/token'

import { env } from 'env.mjs'

const schema = z.object({
  token: z.string().startsWith('0x'),
  amount: z.string(),
  toAddress: z.string().startsWith('0x'),
})

type WithdrawForm = z.infer<typeof schema>

const defaultValues: WithdrawForm = {
  token: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  amount: '',
  toAddress: '',
}

const TOKENS = { ...TOKENS_FROM, ...TOKENS_TO }

const WithdrawButton = ({ tbaAddress }: { tbaAddress: string }) => {
  const signer = useSigner()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

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

  const {
    data: balances,
    isLoading: balancesLoading,
    error,
    refetch,
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

  const onSubmit = async (data: WithdrawForm) => {
    if (BigInt(+data.amount * 10 ** TOKENS[data.token].decimal) > BigInt(balances?.[data.token as `0x${string}`] || 0)) {
      setError('amount', { type: 'custom', message: 'Not enough balance' })
      return
    }

    const tokenboundClient = new TokenboundClient({
      signer: signer,
      chainId: +env.NEXT_PUBLIC_CHAIN_ID,
      implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
      registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
    })

    try {
      const txHash = await tokenboundClient.transferERC20({
        account: tbaAddress as `0x${string}`,
        amount: +data.amount,
        recipientAddress: data.toAddress as `0x${string}`,
        erc20tokenAddress: data.token as `0x${string}`,
        erc20tokenDecimals: TOKENS[data.token].decimal,
      })

      toast.success(
        <p>
          Successfully transferred {TOKENS[data.token].name}.&nbsp;
          <a
            className="underline"
            href={`${EXPLORER[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]}/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            {txHash}
          </a>
        </p>
      )

      refetch()
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to withdraw')
    }
  }

  const renderBalance = (token: `0x${string}`) => {
    const tokenBalance = balances?.[token]

    if (tokenBalance === undefined) {
      return '-'
    }

    try {
      const tokenBalanceInBigInt = BigInt(tokenBalance)

      return formatUnits(tokenBalanceInBigInt, TOKENS[token].decimal)
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
      >
        <ModalContent className="bg-black text-white">
          {() => (
            <>
              <ModalHeader className="justify-center font-bold text-2xl">Withdraw from Beep</ModalHeader>
              <ModalBody className="px-8 pb-8 tracking-wide">
                <form
                  className="flex flex-col items-center gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
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
                            items={Object.values(TOKENS)}
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
                            startContent={<div className="h-6 w-6 shrink-0">{TOKENS[field.value].icon && TOKENS[field.value].icon()}</div>}
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
                  <div className="w-full flex flex-col items-center">
                    <Controller
                      control={control}
                      name="toAddress"
                      render={({ field, fieldState }) => (
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
                          // errorMessage={fieldState.error?.message}
                          label="toAddress"
                          onValueChange={value => {
                            field.onChange(value)
                            clearErrors('toAddress')
                          }}
                          placeholder="0x"
                          value={field.value}
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
