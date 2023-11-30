'use client'

import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { env } from 'env.mjs'
import { gasInfoMap } from '@/constants/scroller/scroller'

const schema = z.object({
  gasTolerance: z.number().int().min(0).max(2),
})

export type PlanForm = z.infer<typeof schema>

interface IPlanModalProps {
  gasTolerance: number
  isOpen: boolean
  onOpenChange: () => void
  onSubmit: (data: PlanForm) => unknown | Promise<unknown>
}

const PlanModal = ({ gasTolerance: defaultGasTolerance, isOpen, onOpenChange, onSubmit }: IPlanModalProps) => {
  const {
    control,
    setValue,
    clearErrors,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PlanForm>({
    defaultValues: {
      gasTolerance: defaultGasTolerance,
    },
    resolver: zodResolver(schema),
  })

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
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalContent className="bg-black text-white">
        {() => (
          <>
            <ModalHeader className="justify-center font-bold text-2xl">Update Your Gas Tolerance</ModalHeader>
            <ModalBody className="px-8 pb-8">
              <form
                className="flex flex-col items-center"
                onSubmit={handleSubmit(_onSubmit)}
              >
                {/* TODO */}
                <div className="w-[320px] max-w-[320px] flex flex-col items-center gap-8">
                  <p>Your scroller is currently set to {'MEDIUM'}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Controller
                      control={control}
                      name="gasTolerance"
                      render={({ field }) => (
                        <div className="flex justify-between gap-6 text-center">
                          <label
                            className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                              field.value === 1 ? 'bg-blue-500 text-white' : 'border hover:scale-[97%] transform transition-transform'
                            }`}
                          >
                            <input
                              type="radio"
                              value="1"
                              checked={field.value === 1}
                              onChange={() => field.onChange(1)}
                              className="hidden"
                            />
                            <p className="text-base font-bold pb-2 text-xl">LOW</p>
                            <p className="text-sm">
                              ${gasInfoMap[1].price.from}-{gasInfoMap[1].price.to}
                            </p>
                            <p className="text-xs">Usually executes within 48 hours</p>
                          </label>

                          <label
                            className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                              field.value === 2 ? 'bg-blue-500 text-white' : 'border hover:scale-[97%] transform transition-transform'
                            }`}
                          >
                            <input
                              type="radio"
                              value="2"
                              checked={field.value === 2}
                              onChange={() => field.onChange(2)}
                              className="hidden"
                            />
                            <p className="text-base font-bold pb-2 text-xl">MED</p>
                            <p className="text-sm">
                              ${gasInfoMap[2].price.from}-{gasInfoMap[2].price.to}
                            </p>
                            <p className="text-xs">Usually executes within 24 hours</p>
                          </label>

                          <label
                            className={`rounded-md w-1/3 text-sm p-8 cursor-pointer ${
                              field.value === 3 ? 'bg-blue-500 text-white' : 'border hover:scale-[97%] transform transition-transform'
                            }`}
                          >
                            <input
                              type="radio"
                              value="3"
                              checked={field.value === 3}
                              onChange={() => field.onChange(3)}
                              className="hidden"
                            />
                            <p className="text-base font-bold pb-2 text-xl">HIGH</p>
                            <p className="text-sm">
                              ${gasInfoMap[3].price.from}-{gasInfoMap[3].price.to}
                            </p>
                            <p className="text-xs">Usually executes within 1 hours</p>
                          </label>
                        </div>
                      )}
                    />
                  </div>
                  <div className="w-full text-center text-sm opacity-50 text-xs">
                    Updating your gas tolerance requires an on-chain transaction, costs paid by your EOA wallet.
                  </div>
                  <Button
                    className="w-[200px] bg-white font-bold text-sm text-black tracking-wide rounded-full"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
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
