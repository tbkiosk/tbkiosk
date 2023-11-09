'use client'

import { useState, useEffect } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Select, SelectItem, Input, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { explorer } from '@/constants/explorer'
import { USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS, USDC_DECIMAL, WETH_DECIMAL } from '@/constants/token'

import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import USDC from 'public/icons/tokens/usdc.svg'

import { env } from 'env.mjs'

const WithdrawButton = ({ tbaAddress }: { tbaAddress: string }) => {
  const signer = useSigner()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [token, setToken] = useState('Ethereum')
  const [amount, setAmount] = useState('0')
  const [amountError, setAmountError] = useState<null | string>(null)
  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState<null | string>(null)
  const [withdrawing, setWithdrawing] = useState(false)

  const {
    data: balances,
    isLoading: balancesLoading,
    error,
  } = useQuery<{ usdc: string; weth: string }>({
    queryKey: ['tba-balances', tbaAddress],
    queryFn: async () => {
      const res = await fetch(`/api/beep/profile/${tbaAddress}/balances`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return await res.json()
    },
    enabled: isOpen,
  })

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load balances')
    }
  }, [error])

  const onConfirmWithdrawal = async () => {
    if (isNaN(+amount) || !+amount) {
      setAmountError('Invalid amount')
      return
    }

    if (!/^0[xX][0-9a-fA-F]*$/.test(address)) {
      setAddressError('Invalid address')
      return
    }

    if (token === 'Ethereum' && +amount > +(balances?.weth ?? 0)) {
      setAmountError('Not enough Ethereum balance')
      return
    }

    if (token === 'USDC' && +amount > +(balances?.usdc ?? 0)) {
      setAmountError('Not enough USDC balance')
      return
    }

    const tokenboundClient = new TokenboundClient({
      signer: signer,
      chainId: +env.NEXT_PUBLIC_CHAIN_ID,
      implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
    })

    try {
      setWithdrawing(true)

      if (token === 'Ethereum') {
        const txHash = await tokenboundClient.transferERC20({
          account: tbaAddress as `0x${string}`,
          amount: +amount,
          recipientAddress: address as `0x${string}`,
          erc20tokenAddress: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137] as `0x${string}`,
          erc20tokenDecimals: WETH_DECIMAL,
        })

        toast.success(
          <p>
            Successfully transferred WETH.&nbsp;
            <a
              className="underline"
              href={`${explorer[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]}/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              {txHash}
            </a>
          </p>
        )
        return
      }

      if (token === 'USDC') {
        const txHash = await tokenboundClient.transferERC20({
          account: tbaAddress as `0x${string}`,
          amount: +amount,
          recipientAddress: address as `0x${string}`,
          erc20tokenAddress: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137] as `0x${string}`,
          erc20tokenDecimals: USDC_DECIMAL,
        })

        toast.success(
          <p>
            Successfully transferred USDC.&nbsp;
            <a
              className="underline"
              href={`${explorer[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137]}/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              {txHash}
            </a>
          </p>
        )
        return
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to withdraw')
    } finally {
      setWithdrawing(false)
    }
  }

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
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full flex flex-col items-center gap-2">
                    <Select
                      classNames={{
                        base: 'w-full max-w-[320px] border border-[#808080] rounded-full',
                        label: 'hidden',
                        popoverContent: 'bg-[#0f0f0f]',
                        trigger: 'h-[56px] bg-black hover:!bg-[#0f0f0f]',
                        value: 'font-bold text-lg text-center',
                      }}
                      label="Select token"
                      labelPlacement="outside"
                      onSelectionChange={keys => {
                        setAmountError(null)
                        Array.from(keys)[0] && setToken(Array.from(keys)[0].toString())
                      }}
                      radius="full"
                      selectedKeys={[token]}
                      selectorIcon={<></>}
                      size="sm"
                      startContent={<span className="h-10 w-10">{token === 'Ethereum' ? <EthereumCircle /> : <USDC />}</span>}
                    >
                      {['Ethereum', 'USDC'].map(_token => (
                        <SelectItem
                          classNames={{ base: '!bg-[#0f0f0f] !text-white hover:!bg-[#1f1f1f] [&[data-selected]]:!bg-[#1f1f1f]' }}
                          key={_token}
                          value={_token}
                        >
                          {_token}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="text-center text-sm">
                      {balancesLoading ? (
                        <Spinner
                          color="default"
                          size="sm"
                        />
                      ) : (
                        `Balance: ${token === 'Ethereum' ? balances?.weth || '-' : balances?.usdc || '-'}`
                      )}
                    </div>
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <Input
                      className="w-full max-w-[320px]"
                      classNames={{
                        base: 'px-4 rounded-full border border-[#808080]',
                        label: '!font-normal text-white',
                        innerWrapper: 'bg-transparent',
                        input: 'bg-transparent font-bold text-lg text-end',
                        inputWrapper: '!bg-transparent',
                      }}
                      label="Amount"
                      onValueChange={value => {
                        setAmountError(null)
                        if (/^\d*(\.\d*)?$/.test(value)) {
                          setAmount(value)
                        }
                      }}
                      value={amount}
                    />
                    {amountError && <p className="text-sm text-center text-red-500">{amountError}</p>}
                  </div>
                  <div className="w-full flex flex-col items-center">
                    <Input
                      className="w-full max-w-[320px]"
                      classNames={{
                        base: 'px-4 rounded-full border border-[#808080]',
                        label: '!font-normal text-white',
                        innerWrapper: 'bg-transparent',
                        input: 'bg-transparent font-bold text-lg text-end',
                        inputWrapper: '!bg-transparent',
                      }}
                      label="Withdrawal address"
                      maxLength={128}
                      onValueChange={value => {
                        setAddressError(null)
                        setAddress(value)
                      }}
                      placeholder="0x"
                      value={address}
                    />
                    {addressError && <p className="text-sm text-center text-red-500">{addressError}</p>}
                  </div>
                  <Button
                    className="h-12 w-full max-w-[320px] mt-8 px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
                    disabled={balancesLoading}
                    isLoading={withdrawing}
                    onClick={onConfirmWithdrawal}
                  >
                    Confirm withdrawal
                  </Button>
                </div>
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
