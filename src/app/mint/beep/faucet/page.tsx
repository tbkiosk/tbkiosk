'use client'

import ConnectWalletButton from '@/components/connect_wallet_button'
import { ThirdwebSDK, useContract, useSigner } from '@thirdweb-dev/react'
import type { ThirdWebError } from '@/types'

import React from 'react'
import { env } from 'env.mjs'
import { toast } from 'react-toastify'
import { Button } from '@nextui-org/react'

const faucet = () => {
  const [isWithdrawn, setIsWithdrawn] = React.useState(false)
  const signer = useSigner()
  const abi = [{ inputs: [], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' }]
  const { contract: tokenFaucet } = useContract('0x79E0a7769F078A75F5AeFBCDd98cD94700329D6C', abi)

  const handleClick = async () => {
    if (!signer) {
      toast.error('Signer not defined')
      return
    }

    if (!tokenFaucet) {
      toast.error('Failed to collect contract information')
      return
    }

    try {
      const sdk = ThirdwebSDK.fromSigner(signer, env.NEXT_PUBLIC_CHAIN_ID, {
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      })
      const faucetContract = await sdk.getContract('0x79E0a7769F078A75F5AeFBCDd98cD94700329D6C', abi)

      const mintOptions = {
        gasLimit: 500_000,
      }

      await faucetContract.call('withdraw', [], mintOptions)

      if (toast.success) {
        toast.success('Withdraw successful')
        setIsWithdrawn(true)
      }
    } catch (error) {
      toast.error((error as ThirdWebError)?.reason || (error as Error)?.message || 'Failed to withdraw')
    }
  }

  return (
    <div className="p-10 bg-gray-950 w-screen h-screen">
      <div>
        <ConnectWalletButton
          className="!bg-transparent !font-medium !text-[#78edc1] [&>div>span:first-child]:text-[#78edc1]"
          style={{ border: '1px solid #78edc1' }}
        />
      </div>
      {!isWithdrawn ? (
        <Button
          className="!bg-transparent !font-medium !text-[#78edc1] [&>div>span:first-child]:text-[#78edc1] mt-10"
          style={{ border: '1px solid #78edc1' }}
          onClick={handleClick}
        >
          Withdraw USDC
        </Button>
      ) : (
        <div className="color-white">Thank You! Beep boop.</div>
      )}
    </div>
  )
}

export default faucet
