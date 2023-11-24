'use client'

import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import BeepConfig from './beep_config'
import BeepPreview from './beep_preview'
import BeepConfirm from './beep_confirm'
import BeepSuccess from './beep_success'

import { TBA_USER_CONFIG_SCHEMA } from 'prisma/schema'

import { USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from '@/constants/token'

import { env } from 'env.mjs'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

const defaultValues = {
  tokenAddressFrom: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  tokenAddressTo: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  amount: 20,
  frequency: 7,
  endDate: dayjs().add(8, 'days').toISOString(),
  mintAmount: 1,
  depositAmount: 120,
}

const DeployModal = ({ isOpen, onOpenChange, onClose }: ReturnType<typeof useDisclosure>) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(4)

  const form = useForm<ConfigForm>({
    defaultValues,
    resolver: zodResolver(TBA_USER_CONFIG_SCHEMA),
  })

  useEffect(() => {
    setStep(1)

    if (isOpen) {
      form.reset(defaultValues)
    }
  }, [isOpen])

  return (
    <Modal
      hideCloseButton={form.formState.isSubmitting}
      isDismissable={form.formState.isSubmitting}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalContent>
        {() =>
          isOpen && (
            <>
              <ModalHeader className="justify-center">
                {match(step)
                  .with(1, () => 'Configure your Beep DCA')
                  .with(2, () => 'Review your Beep')
                  .with(3, () => 'Confirm')
                  .with(4, () => null)
                  .exhaustive()}
              </ModalHeader>
              <ModalBody className="px-8 pb-8">
                {match(step)
                  .with(1, () => (
                    <BeepConfig
                      {...form}
                      setStep={setStep}
                    />
                  ))
                  .with(2, () => (
                    <BeepPreview
                      {...form}
                      setStep={setStep}
                    />
                  ))
                  .with(3, () => (
                    <BeepConfirm
                      {...form}
                      setStep={setStep}
                    />
                  ))
                  .with(4, () => (
                    <BeepSuccess
                      {...form}
                      onClose={onClose}
                    />
                  ))
                  .exhaustive()}
              </ModalBody>
            </>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default DeployModal
