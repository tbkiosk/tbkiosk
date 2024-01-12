'use client'

import React from 'react'
import { useAddress, useChainId, useSigner } from '@thirdweb-dev/react'
import ConnectWalletButton from './components/connect_wallet_button_k'
// import WithdrawButton from './components/withdraw_button_k'
import { Button } from '@nextui-org/react'
import { TBAccountParams, TokenboundClient } from '@tokenbound/sdk'
import { env } from 'env.mjs'
import { toast } from 'react-toastify'
import { EXPLORER } from '@/constants/explorer'
import LogoBlack from 'public/logo/sl1_logo-black.svg'
import LogoText from 'public/logo/sl_logo-text.svg'
import { Network } from './components/switch_chain'
// import { JsonRpcProvider, Wallet, formatEther } from 'ethers'
// import { USDC_DECIMAL } from '../../constants/token'

const NFT_CONTRACT = '0x9cAc72EFe455ADb4f413A8592eD98f962B7bE293' as `0x${string}`
const TBA_CONTRACT = '0xB9A74fea948e8d5699Df97DC114938Bee97813a8' as `0x${string}`
const REGISTRY_CONTRACT = '0x02101dfb77fde026414827fdc604ddaf224f0921' as `0x${string}`

const CHAIN_ID = 1

const USDC_CONTRACT = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`
const USDC_DECIMALS = 6
const USDC_AMOUNT = 100

const TBA_ADDRESS = '0x07731Bed81FF334f8C44981e90fa35fBD0169c86' as `0x${string}`
const PARENT_ADDRESS = '0xAB279df9e6DfC08c3298322542E3116c44E64DE3' as `0x${string}`

const page = () => {
  const address = useAddress()
  const signer = useSigner()
  const chainId = useChainId()

  // const provider = new JsonRpcProvider(RPC)

  const handleClick = async () => {
    const tokenboundClient = new TokenboundClient({
      signer: signer,
      chainId: 1,
      implementationAddress: TBA_CONTRACT,
      registryAddress: REGISTRY_CONTRACT,
    })

    // const tokenBoundAccount = tokenboundClient.getAccount({
    //   tokenContract: NFT_CONTRACT as TBAccountParams['tokenContract'],
    //   tokenId: '21',
    // })

    try {
      const txHash = await tokenboundClient.transferERC20({
        account: TBA_ADDRESS as `0x${string}`,
        amount: USDC_AMOUNT,
        recipientAddress: PARENT_ADDRESS as `0x${string}`,
        erc20tokenAddress: USDC_CONTRACT as `0x${string}`,
        erc20tokenDecimals: USDC_DECIMALS,
      })
      toast.success(
        <p>
          Success
          <a
            className="underline"
            href={`https://etherscan.io/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            {txHash}
          </a>
        </p>
      )
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to withdraw')
    }
  }

  const handleClick2 = async () => {
    const tokenboundClient = new TokenboundClient({
      signer: signer,
      chainId: 1,
      implementationAddress: '0xB9A74fea948e8d5699Df97DC114938Bee97813a8', // Beep mainnet
      registryAddress: '0x02101dfb77fde026414827fdc604ddaf224f0921', // registry v2
    })

    try {
      const txHash = await tokenboundClient.transferERC20({
        account: '0x07731Bed81FF334f8C44981e90fa35fBD0169c86' as `0x${string}`,
        amount: 100,
        recipientAddress: '0xAB279df9e6DfC08c3298322542E3116c44E64DE3' as `0x${string}`,
        erc20tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
        erc20tokenDecimals: 6,
      })

      toast.success(
        <p>
          Success
          <a
            className="underline"
            href={`https://etherscan.io/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            {txHash}
          </a>
        </p>
      )
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to withdraw')
    }
  }

  return (
    <div>
      <header className="h-[var(--header-height)] w-full fixed top-0 z-30">
        <div className="h-full max-w-screen-2xl px-4 md:px-8 py-2 mx-auto flex items-center justify-between">
          <div className="w-auto md:w-[180px] flex gap-4 items-center text-white">
            <div className="w-[2.75rem] h-[2.75rem] text-white">
              <LogoBlack />
            </div>
            <div className="h-5 hidden md:block text-black">
              <LogoText />
            </div>
          </div>
          <div className="w-auto md:w-[180px] flex gap-4 items-center justify-end">
            <ConnectWalletButton />
          </div>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-500">
        {!address ? (
          <div>Please connect your wallet</div>
        ) : (
          <div className="w-1/2 text-center">
            <p className="pb-6">
              This is a bespoke page to withdraw <br />
              <span className="font-bold">100 USDC</span> <br />
              from Beep #21 address
              <br />
              <span className="font-bold"> 0x07731Bed81FF334f8C44981e90fa35fBD0169c86</span> <br />
              to its Owner <br />
              <span className="font-bold"> 0xAB279df9e6DfC08c3298322542E3116c44E64DE3</span>
            </p>

            {chainId != 1 && address ? (
              <Network />
            ) : (
              <Button
                variant="solid"
                onClick={() => handleClick()}
              >
                Withdraw
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default page
