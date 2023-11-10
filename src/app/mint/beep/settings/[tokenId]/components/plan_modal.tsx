'use client'

import { useState, forwardRef } from 'react'
import { useSigner } from '@thirdweb-dev/react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, InputProps } from '@nextui-org/react'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import clsx from 'clsx'
import dayjs from 'dayjs'

import ETH from 'public/icons/tokens/ethereum-circle.svg'
import USDC from 'public/icons/tokens/usdc.svg'

import { FREQUENCY_OPTIONS } from '@/constants/beep'

const PlanModal = ({
  amount: propAmount,
  frequncy: propFrequncy,
  endDate: propEndDate,
  isOpen,
  onOpenChange,
  onSuccess,
  refetch,
  tbaAddress,
}: {
  amount?: string
  frequncy?: string
  endDate?: number | null
  isOpen: boolean
  onOpenChange: () => void
  onSuccess?: () => void
  refetch: () => Promise<unknown>
  tbaAddress: string
}) => {
  const signer = useSigner()

  const [amount, setAmount] = useState(propAmount || '0')
  const [amountError, setAmountError] = useState<null | string>(null)
  const [frequency, setFrequency] = useState(propFrequncy || '1')
  const [endDate, setEndDate] = useState<Date | null>(propEndDate ? new Date(propEndDate) : null)
  const [isAccountUpdating, setIsAccountUpdating] = useState(false)

  const onValueChange = (value: string) => {
    setAmountError(null)

    if (!/^(\s*|\d+)$/.test(value)) return

    setAmount(String(+value))
  }

  const onSave = async () => {
    if (isNaN(+amount) || +amount < 60) {
      setAmountError('Please DCA with a minimum of $60 to ensure profitability after accounting for gas fees.')
      return
    }

    setIsAccountUpdating(true)

    try {
      await signer?.signMessage(
        JSON.stringify({
          ID: tbaAddress,
          AMOUNT: amount,
          FREQUENCY: frequency,
          END_DATE: endDate ? +endDate : null,
        })
      )

      const res = await fetch(`/api/beep/profile/${tbaAddress}`, {
        method: 'PUT',
        body: JSON.stringify({
          ID: tbaAddress,
          AMOUNT: amount,
          FREQUENCY: frequency,
          END_DATE: endDate ? +endDate : null,
        }),
      })

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const response = await res.json()
      if (response?.user) {
        toast.success('Successfully updated account')

        onSuccess?.()
        refetch()
      }
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to update account')
    } finally {
      setIsAccountUpdating(false)
    }
  }

  // eslint-disable-next-line
  const EndDateInput = forwardRef<HTMLInputElement>(({ value, onClick }: InputProps, ref) => (
    <Input
      classNames={{
        base: 'px-4 rounded-full border border-[#808080]',
        clearButton: '!bottom-3',
        label: '!font-normal text-white',
        innerWrapper: 'bg-transparent',
        input: 'bg-transparent font-bold text-lg text-end',
        inputWrapper: '!bg-transparent',
      }}
      isClearable
      label="End date"
      onClear={() => setEndDate(null)}
      onClick={onClick}
      ref={ref}
      value={value ? dayjs(value).format('MM/DD/YYYY') : ''}
    />
  ))

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
                          <ETH />
                        </span>
                      }
                    >
                      WETH
                    </Button>
                  </div>
                  <div>
                    <Input
                      classNames={{
                        base: 'pl-4 rounded-full border border-[#808080]',
                        label: '!font-normal text-white',
                        innerWrapper: 'bg-transparent',
                        input: 'bg-transparent font-bold text-lg text-end',
                        inputWrapper: '!bg-transparent',
                      }}
                      endContent={
                        <Button
                          className="w-[120px] bg-[#292929] text-white rounded-full"
                          disableRipple
                          startContent={
                            <span className="h-6 w-6 shrink-0">
                              <USDC />
                            </span>
                          }
                        >
                          USDC
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
                  <div className="w-full [&>.react-datepicker-wrapper]:w-full">
                    <DatePicker
                      customInput={<EndDateInput />}
                      minDate={dayjs().add(1, 'day').toDate()}
                      onChange={setEndDate}
                      popperPlacement="top"
                      selected={endDate}
                    />
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
