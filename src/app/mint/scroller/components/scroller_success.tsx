'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { Spinner, Button } from '@nextui-org/react'
import { type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { SCROLLER_USER_CONFIG_SCHEMA } from '@/types/schema'
import RobotSuccess from 'public/beep/robot-success.svg'
import { env } from 'env.mjs'
import { abi } from '@/utils/scrollerNft_abiEnumerable'
import { toast } from 'react-toastify'
import useTbaScrollerUser from '@/hooks/useTbaScrollerUser'
import CopyButton from '@/components/copy_button'
import { maskAddress } from '@/utils/address'

type ConfigForm = z.infer<typeof SCROLLER_USER_CONFIG_SCHEMA>

const ScrollerSuccess = ({ getValues, onClose }: UseFormReturn<ConfigForm> & { onClose: () => void }) => {
  const address = useAddress()
  const { contract } = useContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)
  const { data, isLoading } = useOwnedNFTs(contract, address)
  const { email } = getValues()
  const [lastTokenId, setLastTokenId] = useState<string>()

  useEffect(() => {
    if (data && data.length > 0) {
      const tokenId = data[data.length - 1].metadata.id
      setLastTokenId(tokenId)
    }
  }, [data])

  const { tba } = useTbaScrollerUser(+lastTokenId!)

  const storeData = useCallback(async () => {
    if (email && tba.address) {
      try {
        const tbaAddress = tba.address
        const response = await fetch('/api/scroller/profile/store-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tbaAddress }),
        })

        if (!response.ok) {
          throw new Error('Failed to store email')
        }

        const responseData = await response.json()
        toast.success(`Email stored successfully: ${responseData.email}`)
      } catch (error) {
        console.error(error)
        toast.error('Error occurred while storing email')
      }
    }
  }, [email, tba.address])

  useEffect(() => {
    if (email && tba.address) {
      storeData()
    }
  }, [email, tba.address, storeData])

  return (
    <div className="font-medium">
      {isLoading ? (
        <div className="min-h-[120px] flex justify-center items-center">
          <Spinner color="default" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <div className="h-16 flex justify-center">
            <RobotSuccess />
          </div>
          <div>Congrats, your Scroller Pass is live and ready to use!</div>
          <CopyButton
            className="px-4 py-1 rounded-full font-normal text-sm text-[#a6a9ae] hover:border-[#666666]"
            copyText={tba.address}
          >
            {maskAddress(tba.address)}
          </CopyButton>
          <a
            href="/mint/scroller/settings"
            target="_blank"
          >
            <Button
              className="h-14 w-full bg-black text-2xl text-white rounded-full px-8"
              onClick={onClose}
            >
              Go to Settings Page
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}

export default ScrollerSuccess
