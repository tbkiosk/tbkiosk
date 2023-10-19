'use client'

import { useState } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { toast } from 'react-toastify'
import clsx from 'clsx'

import EthereumCircle from 'public/icons/tokens/ethereum-circle.svg'
import USDC from 'public/icons/tokens/usdc.svg'

const FREQUENCY_OPTIONS = [
  { frequency: '1', name: 'Daily' },
  { frequency: '7', name: 'Weekly' },
  { frequency: '14', name: 'Bi-Weekly' },
  { frequency: '30', name: 'Montly' },
]

const PlanModal = ({
  amount: propAmount,
  frequncy: propFrequncy,
  isOpen,
  onOpenChange,
  refetch,
  tbaAddress,
}: {
  amount?: string
  frequncy?: string
  isOpen: boolean
  onOpenChange: () => void
  refetch: () => Promise<unknown>
  tbaAddress: string
}) => {
  const signer = useSigner()

  const [amount, setAmount] = useState<string>(propAmount || '0')
  const [amountError, setAmountError] = useState<null | string>(null)
  const [frequency, setFrequency] = useState<string>(propFrequncy || '1')
  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  const onValueChange = (value: string) => {
    setAmountError(null)

    if (!/^(\s*|\d+)$/.test(value)) return

    setAmount(String(+value))
  }

  const onSave = async () => {
    if (isNaN(+amount) || +amount < 20) {
      setAmountError('Amount should be no less than 20')
      return
    }

    setIsAccountUpdating(true)

    try {
      await signer?.signMessage(
        JSON.stringify({
          ID: tbaAddress,
          AMOUNT: amount,
          FREQUENCY: frequency,
        })
      )

      const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
        method: 'PUT',
        body: JSON.stringify({
          ID: tbaAddress,
          AMOUNT: amount,
          FREQUENCY: frequency,
        }),
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response = await res.json()
      if (response?.user) {
        toast.success('Successfully updated account')

        refetch()
      }
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to update account')
    } finally {
      setIsAccountUpdating(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalContent className="bg-black text-white">
        {() => (
          <>
            <ModalHeader className="justify-center font-bold text-2xl">Dollar Cost Averaging Plan</ModalHeader>
            <ModalBody className="px-8 pb-8">
              <div className="flex flex-col items-center">
                <div className="w-[320px] max-w-[320px] flex flex-col items-center gap-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Auto invest in</span>
                    <Button
                      className="bg-[#292929] text-white rounded-full"
                      disableRipple
                      startContent={
                        <span className="h-6 w-6">
                          <EthereumCircle />
                        </span>
                      }
                    >
                      ETH
                    </Button>
                  </div>
                  <div>
                    <Input
                      classNames={{
                        base: 'px-4 rounded-full border border-[#808080]',
                        label: '!font-normal text-white',
                        innerWrapper: 'bg-transparent',
                        input: 'bg-transparent font-bold text-lg text-end',
                        inputWrapper: '!bg-transparent',
                      }}
                      endContent={
                        <Button
                          className="bg-[#292929] text-white rounded-full"
                          disableRipple
                          startContent={
                            <span className="h-6 w-6 shrink-0">
                              <USDC />
                            </span>
                          }
                        >
                          ETH
                        </Button>
                      }
                      label="Amount Per Period"
                      onValueChange={onValueChange}
                      value={amount}
                    />
                    {amountError && <p className="text-sm text-center text-red-500">{amountError}</p>}
                  </div>
                  <div className="w-full">
                    <p className="mb-4 text-xs text-left">Recurring Cycle</p>
                    <div className="flex gap-1 no-wrap">
                      {FREQUENCY_OPTIONS.map(_option => (
                        <Button
                          className={clsx(
                            'bg-transparent font-bold text-white text-xs border border-[#808080] rounded-full',
                            frequency === _option.frequency && 'bg-[#10cb93] font-bold text-black border-none'
                          )}
                          disabled={isAccountUpdating}
                          key={_option.frequency}
                          onPress={() => setFrequency(_option.frequency)}
                        >
                          {_option.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button
                    className="w-[200px] bg-white font-bold text-sm text-black tracking-wide rounded-full"
                    isLoading={isAccountUpdating}
                    onPress={onSave}
                  >
                    Save Plan
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PlanModal
