'use client'

import { useMemo } from 'react'
import { useAddress, useSigner, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { TokenboundClient } from '@tokenbound/sdk'
import { Spinner, Button } from '@nextui-org/react'
import { type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { SCROLLER_USER_CONFIG_SCHEMA } from '@/types/schema'

import { maskAddress } from '@/utils/address'

import RobotSuccess from 'public/beep/robot-success.svg'

import { env } from 'env.mjs'
import { abi } from '@/utils/scrollerNft_abi'

type ConfigForm = z.infer<typeof SCROLLER_USER_CONFIG_SCHEMA>

const ScrollerSuccess = ({ getValues, onClose }: UseFormReturn<ConfigForm> & { onClose: () => void }) => {
  const address = useAddress()
  const signer = useSigner()
  const { contract } = useContract(env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS, abi)
  const { data, isLoading } = useOwnedNFTs(contract, address)

  const { mintAmount } = getValues()

  const ownedNFTs = useMemo(() => data?.map(nft => nft.metadata.id), [data])
  const mintedNFTs = ownedNFTs?.slice(-1 * mintAmount)

  const tokenboundClient = new TokenboundClient({
    signer: signer,
    chainId: +env.NEXT_PUBLIC_CHAIN_ID_SCROLLER,
    implementationAddress: env.NEXT_PUBLIC_SCROLLER_TBA_IMPLEMENTATION_ADDRESS as `0x${string}`,
    registryAddress: env.NEXT_PUBLIC_REGISTRY_ADDRESS_SCROLLER as `0x${string}`,
  })

  return (
    <div className="font-medium">
      {isLoading && (
        <div className="min-h-[120px] flex justify-center items-center">
          <Spinner color="default" />
        </div>
      )}
      <div className="flex flex-col gap-4 items-center">
        <div className="h-16 flex justify-center">
          <RobotSuccess />
        </div>
        <div>Congrats, Your Scroller Pass is live and ready to use!</div>
        <div className="text-xl text-[#a6a9ae]">
          {mintedNFTs?.map(_nft => (
            <div key={_nft}>
              {maskAddress(
                tokenboundClient.getAccount({
                  tokenContract: env.NEXT_PUBLIC_SCROLLER_NFT_CONTRACT_ADDRESS as `0x${string}`,
                  tokenId: _nft,
                })
              )}
            </div>
          ))}
        </div>
        <a
          href="/mint/scroller/settings"
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

export default ScrollerSuccess
