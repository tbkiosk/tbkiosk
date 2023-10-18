'use client'

import { useState } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { useBalance } from 'wagmi'
import { Button } from '@nextui-org/button'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/modal'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Spinner } from '@nextui-org/spinner'
import { toast } from 'react-toastify'

import { chain } from '@/constants/chain'

import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import USDC from 'public/icons/tokens/usdc.svg'

const WithdrawButton = ({ tbaAddress }: { tbaAddress: string }) => {
  const signer = useSigner()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address: tbaAddress as `0x${string}`,
    chainId: 5,
  })
  const { data: usdcBalance, isLoading: usdcLoading } = useBalance({
    address: tbaAddress as `0x${string}`,
    chainId: 5,
    token: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  })

  const [token, setToken] = useState('Ethereum')
  const [amount, setAmount] = useState('0')
  const [amountError, setAmountError] = useState<null | string>(null)
  const [address, setAddress] = useState('0x')
  const [addressError, setAddressError] = useState<null | string>(null)
  const [withdrawing, setWithdrawing] = useState(false)

  const onConfirmWithdrawal = async () => {
    if (isNaN(+amount)) {
      setAmountError('Invalid amount')
      return
    }

    if (token === 'Ethereum' && +amount > (ethBalance?.value ?? 0)) {
      setAmountError('Not enough Ethereum balance')
      return
    }

    if (token === 'USDC' && +amount > (usdcBalance?.value ?? 0)) {
      setAmountError('Not enough USDC balance')
      return
    }

    const tokenboundClient = new TokenboundClient({ signer: signer, chainId: chain.chainId })

    try {
      setWithdrawing(true)

      if (token === 'Ethereum') {
        const txHash = await tokenboundClient.transferETH({
          account: tbaAddress as `0x${string}`,
          amount: +amount,
          recipientAddress: address as `0x${string}`,
        })

        toast.success('')
        return
      }

      if (token === 'USDC') {
        const txHash = await tokenboundClient.transferERC20({
          account: tbaAddress as `0x${string}`,
          amount: +amount,
          recipientAddress: address as `0x${string}`,
          erc20tokenAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
          erc20tokenDecimals: usdcBalance?.decimals || 6,
        })

        toast.success('')
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
                        popover: 'bg-[#0f0f0f]',
                        trigger: 'h-[56px] bg-black hover:!bg-[#0f0f0f]',
                        value: 'font-bold text-lg text-center',
                      }}
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
                    {token === 'Ethereum' && (
                      <p className="text-center text-sm">
                        {ethLoading ? (
                          <Spinner
                            color="default"
                            size="sm"
                          />
                        ) : (
                          `Balance: ${ethBalance?.formatted || '-'}`
                        )}
                      </p>
                    )}
                    {token === 'USDC' && (
                      <p className="text-center text-sm">
                        {ethLoading ? (
                          <Spinner
                            color="default"
                            size="sm"
                          />
                        ) : (
                          `Balance: ${usdcBalance?.formatted || '-'}`
                        )}
                      </p>
                    )}
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
                        if (/^0[xX][0-9a-fA-F]*$/.test(value)) {
                          setAddress(value)
                        }
                      }}
                      value={address}
                    />
                    {addressError && <p className="text-sm text-center text-red-500">{addressError}</p>}
                  </div>
                  <Button
                    className="h-12 w-full max-w-[320px] mt-8 px-8 bg-white font-bold text-xl text-black rounded-full tracking-wider transition-colors hover:bg-[#e1e1e1]"
                    disabled={ethLoading || usdcLoading}
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
