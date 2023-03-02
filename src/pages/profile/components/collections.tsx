import { useMemo } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import { useEvmWalletNFTs, useEvmNFTMetadata } from '@moralisweb3/next'

import { Loading } from '@/components'

import useNfts from '@/hooks/useNfts'

import { rawIpfsToUrl } from '@/utils/ipfs'

const transformNftImageURL = (url: string | undefined) => {
  if (!url) {
    return ''
  }

  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('ipfs://')) {
    return rawIpfsToUrl(url as `ipfs://${string}`)
  }

  return ''
}

const CollectionsWrapper = () => {
  const { connected: suiConnected, address: suiAddress = '' } = useWallet()

  const collectionsBaseVisible = useMemo(
    () => suiConnected && suiAddress,
    [suiConnected, suiAddress]
  )

  return (
    <div>
      <div className="py-4 font-bold text-4xl">My collections</div>
      <div className="flex min-h-[320px]">
        {collectionsBaseVisible && <CollectionsBase />}
      </div>
    </div>
  )
}

type NftDisplay = {
  id: string
  image?: string
}

const CollectionsBase = () => {
  const { nfts: suiNftObjects, loading: suiNftLoading } = useNfts()
  const { isFetching: ethNftLoading, data: ethNftObjects } = useEvmWalletNFTs({
    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    format: 'decimal',
    limit: 10,
  })
  const nfts: NftDisplay[] = useMemo(() => {
    const transformedSuiNfts: NftDisplay[] = suiNftObjects
      .map((nft) =>
        'fields' in nft.data
          ? {
              id: (nft.data.fields?.id?.id || '') as string,
              image: transformNftImageURL(nft.data.fields?.url),
            }
          : null
      )
      .filter((nft) => !!nft) as NftDisplay[]

    const transformedEvmNfts: NftDisplay[] =
      ethNftObjects?.map((nft) => ({
        id: nft.tokenHash || '',
        image:
          nft?.metadata && 'image' in nft.metadata
            ? transformNftImageURL(nft?.metadata.image as string | undefined)
            : '',
      })) || []

    return [...transformedSuiNfts, ...transformedEvmNfts]
  }, [suiNftObjects, ethNftObjects])

  return (
    <Loading isLoading={suiNftLoading || ethNftLoading}>
      <div className="flex flex-row grow items-center justify-center">
        {nfts.length ? (
          <div className="grow w-full grid grid-cols-3 gap-2">
            {nfts.map((nft) => (
              <div
                className="bg-slate-200 rounded-[5%] overflow-hidden cursor-pointer transition-transform hover:scale-105"
                key={nft.id}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={nft.id}
                  className="h-full w-full object-contain"
                  src={nft.image || '/images/no-media.png'}
                />
              </div>
            ))}
          </div>
        ) : (
          <span>No NFTs</span>
        )}
      </div>
    </Loading>
  )
}

export default CollectionsWrapper
