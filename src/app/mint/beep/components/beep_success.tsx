'use client'

import { useMemo } from 'react'
import { useAddress, useSigner, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { Spinner, Button } from '@nextui-org/react'
import { type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { TBA_USER_CONFIG_SCHEMA } from 'prisma/schema'

import { maskAddress } from '@/utils/address'

import RobotSuccess from 'public/beep/robot-success.svg'

import { env } from 'env.mjs'

type ConfigForm = z.infer<typeof TBA_USER_CONFIG_SCHEMA>

const BeepSuccess = ({ getValues, onClose }: UseFormReturn<ConfigForm> & { onClose: () => void }) => {
  const address = useAddress()
  const signer = useSigner()
  const { contract } = useContract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS_MAINNET)
  const { data, isLoading } = useOwnedNFTs(contract, address)

  const { mintAmount } = getValues()

  const ownedNFTs = useMemo(() => data?.map(nft => nft.metadata.id), [data])
  const mintedNFTs = ownedNFTs?.slice(-1 * mintAmount)

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: +env.NEXT_PUBLIC_CHAIN_ID_MAINNET,
    implementationAddress: env.NEXT_PUBLIC_BEEP_TBA_IMPLEMENTATION_ADDRESS_MAINNET as `0x${string}`,
    registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS_MAINNET as `0x${string}`,
  })

  if (isLoading) {
    return (
      <div className="min-h-[120px] flex justify-center items-center">
        <Spinner color="default" />
      </div>
    )
  }

  if (!mintedNFTs?.length) return null

  if (mintedNFTs.length === 1) {
    return (
      <div className="font-medium">
        <div className="flex flex-col gap-4 items-center">
          <div className="h-16 flex justify-center">
            <RobotSuccess />
          </div>
          <div>Congrats, you have minted Beep #{mintedNFTs[0]}!</div>
          <div>It has been activated and the first transaction has been initiated.</div>
          <div className="text-xl text-[#a6a9ae]">
            {maskAddress(
              tokenboundClient.getAccount({
                tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS_MAINNET as `0x${string}`,
                tokenId: mintedNFTs[0],
              })
            )}
          </div>
          <a
            href="/mint/beep/settings"
            target="_blank"
          >
            <Button
              className="h-14 w-full bg-black text-2xl text-white rounded-full"
              onClick={() => onClose()}
            >
              Go to Settings Page
            </Button>
          </a>
        </div>
      </div>
    )
  }

  if (mintedNFTs.length > 1) {
    return (
      <div className="font-medium">
        <div className="flex flex-col gap-4 items-center">
          <div className="h-16 flex justify-center">
            <RobotSuccess />
          </div>
          <div>Congrats, you have minted the following Beeps!</div>
          <div>They have been activated and the first transactions has been initiated.</div>
          <div className="text-xl text-[#a6a9ae]">
            {mintedNFTs?.map(_nft => (
              <div key={_nft}>
                Beep #{_nft}{' '}
                {maskAddress(
                  tokenboundClient.getAccount({
                    tokenContract: env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS_MAINNET as `0x${string}`,
                    tokenId: _nft,
                  })
                )}
              </div>
            ))}
          </div>
          <a
            href="/mint/beep/settings"
            target="_blank"
          >
            <Button
              className="h-14 w-full bg-black text-2xl text-white rounded-full"
              onClick={() => onClose()}
            >
              Go to Settings Page
            </Button>
          </a>
        </div>
      </div>
    )
  }
}

export default BeepSuccess
