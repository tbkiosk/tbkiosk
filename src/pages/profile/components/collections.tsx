import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@suiet/wallet-kit'
import { useEvmWalletNFTs } from '@moralisweb3/next'
import { useAccount } from 'wagmi'

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

const DEFAULT_NFT_IMAGE_WIDTH = 180

const CollectionsWrapper = () => {
  const { connected: suiConnected, address: suiAddress = '' } = useWallet()
  const { address: ethAddress, isConnected: ethConnected } = useAccount()

  const [isMounted, setIsMounted] = useState(false)

  const collectionsBaseVisible = useMemo(() => {
    if (!isMounted) {
      return false
    }

    return (suiConnected && suiAddress) || (ethConnected && ethAddress)
  }, [suiConnected, suiAddress])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div>
      <div className="py-4 font-bold text-4xl">My collections</div>
      <div className="flex min-h-[320px]">
        {collectionsBaseVisible && (
          <CollectionsBase ethAddress={ethAddress as string} />
        )}
      </div>
    </div>
  )
}

type NftDisplay = {
  id: string
  image?: string
}

type CollectionsBaseProps = {
  ethAddress: string
}

const CollectionsBase = ({ ethAddress }: CollectionsBaseProps) => {
  const { nfts: suiNftObjects, loading: suiNftLoading } = useNfts()
  const { isFetching: ethNftLoading, data: ethNftObjects } = useEvmWalletNFTs({
    address: ethAddress as string,
    format: 'decimal',
    limit: 50,
    chain: 0x1,
  })
  const { isFetching: polygonNftLoading, data: polygonNftObjects } =
    useEvmWalletNFTs({
      address: ethAddress as string,
      format: 'decimal',
      limit: 50,
      chain: 0x89,
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

    const transformedPolygonNfts: NftDisplay[] =
      polygonNftObjects?.map((nft) => ({
        id: nft.tokenHash || '',
        image:
          nft?.metadata && 'image' in nft.metadata
            ? transformNftImageURL(nft?.metadata.image as string | undefined)
            : '',
      })) || []

    return [
      ...transformedSuiNfts,
      ...transformedEvmNfts,
      ...transformedPolygonNfts,
    ]
  }, [suiNftObjects, ethNftObjects, polygonNftObjects])

  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const setWidth = () => {
      const container = document.querySelector('#nft-container')
      if (container) {
        setContainerWidth(container.clientWidth)
      }
    }

    window.addEventListener('resize', () => setWidth())
    setWidth()

    return window.removeEventListener('resize', () => setWidth())
  }, [])

  const nftColumns = useMemo(
    () => Math.ceil(containerWidth / DEFAULT_NFT_IMAGE_WIDTH),
    [containerWidth]
  )

  return (
    <Loading isLoading={suiNftLoading || ethNftLoading || polygonNftLoading}>
      <div className="flex flex-row grow items-center justify-center">
        {nfts.length ? (
          <div
            className="grow w-full grid grid-cols-3 gap-2"
            id="nft-container"
            style={{
              gridTemplateColumns: `repeat(${nftColumns}, minmax(0, 1fr))`,
            }}
          >
            {nfts.map((nft) => (
              <div
                className="bg-slate-200 rounded-[5%] aspect-square overflow-hidden cursor-pointer transition-transform hover:scale-105"
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
