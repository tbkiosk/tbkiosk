'use client'

import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@nextui-org/react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TbaUser } from '@/types'

const schema = z.object({
  gasTolerance: z.number().int().min(0).max(3),
})

export type PlanForm = z.infer<typeof schema>

interface IPlanModalProps {
  gasTolerance: number
  tba: TbaUser
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (data: PlanForm) => unknown | Promise<unknown>
}

const PlanModal = ({ gasTolerance: defaultGasTolerance, tba, isOpen, onOpen, onClose, onOpenChange, onSubmit }: IPlanModalProps) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PlanForm>({
    defaultValues: {
      gasTolerance: defaultGasTolerance,
    },
    resolver: zodResolver(schema),
  })

  const watchedGasTolerance = useWatch({ control, name: 'gasTolerance' })

  const _onSubmit = async (data: PlanForm) => {
    await onSubmit(data)
  }

  useEffect(() => {
    if (isOpen) {
      reset({
        gasTolerance: defaultGasTolerance ?? 0,
      })
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalContent className="bg-[#1D1D1F] text-white">
        {() => (
          <>
            <ModalHeader className="justify-center font-bold text-2xl">Update Scroller Status</ModalHeader>
            <ModalBody className="px-8 pb-8">
              <form
                className="flex flex-col items-center"
                onSubmit={handleSubmit(_onSubmit)}
              >
                <div className="w-[320px] max-w-[320px] flex flex-col text-center items-center gap-8">
                  {tba.gasPref > 0 ? (
                    <p>Scroller Pass is ON and will automatically try to bridge any deposited ETH balance when gas prices are optimal</p>
                  ) : (
                    <p>Scroller Pass is OFF and will not try to bridge until you update its status to ON</p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <Controller
                      control={control}
                      name="gasTolerance"
                      render={({ field }) => (
                        <div className="flex justify-between gap-6 text-center">
                          {/* ON */}
                          <label
                            className={`rounded-md w-1/2 text-sm p-4 px-10 bg-[#2B2B2B] cursor-pointer shadow-md ${
                              field.value > 0 ? 'bg-blue-500 text-white' : 'hover:scale-[97%] transform transition-transform'
                            }`}
                          >
                            <input
                              type="radio"
                              value="1"
                              checked={field.value > 0}
                              onChange={() => field.onChange(1)}
                              className="hidden"
                            />
                            <p className="text-base font-bold pb-2 text-xl">ON</p>
                          </label>

                          {/* OFF */}
                          <label
                            className={`rounded-md w-1/2 text-sm p-4 px-10 bg-[#2B2B2B] cursor-pointer shadow-md ${
                              field.value === 0 ? 'bg-blue-500 text-white' : 'hover:scale-[97%] transform transition-transform'
                            }`}
                          >
                            <input
                              type="radio"
                              value="0"
                              checked={field.value === 0}
                              onChange={() => field.onChange(0)}
                              className="hidden"
                            />
                            <p className="text-base font-bold pb-2 text-xl">OFF</p>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                  <div className="w-full text-center text-sm opacity-50 text-xs">
                    Updating your status requires an on-chain transaction. Gas is paid by your EOA wallet
                  </div>
                  <Button
                    className="w-[200px] bg-white font-bold text-sm text-black tracking-wide rounded-full"
                    disabled={isSubmitting || watchedGasTolerance === defaultGasTolerance}
                    isLoading={isSubmitting}
                    type="submit"
                    onPress={() => {
                      onOpen()
                      onOpenChange(true)
                    }}
                  >
                    Update Gas Tolerance
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PlanModal
