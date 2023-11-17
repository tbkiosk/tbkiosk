'use client'

import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import BeepConfig from './scroller_config'
import BeepPreview from './scroller_preview'
import BeepConfirm from './scroller_confirm'
import BeepSuccess from './scroller_success'

import { TBA_USER_CONFIG_SCHEMA } from '@/types/schema'

import { USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from '@/constants/token'

import { env } from 'env.mjs'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

const defaultValues = {
  tokenAddressFrom: USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  tokenAddressTo: WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
  amount: 60,
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
      hideCloseButton={step === 3}
      isDismissable={step !== 3}
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
                  .with(1, () => 'Configure your Scroller Pass')
                  .with(2, () => 'Review your Scroller Pass')
                  .with(3, () => 'Confirm') // todo: does this exist for scroller?
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
