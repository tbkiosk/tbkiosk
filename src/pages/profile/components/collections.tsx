import { useWallet } from '@suiet/wallet-kit'

import { Loading } from '@/components'

import useNfts from '@/hooks/useNfts'

import { rawIpfsToUrl } from '@/utils/ipfs'

const CollectionsWrapper = () => {
  const { connected, address = '' } = useWallet()

  return (
    <div>
      <div className="py-4 font-bold text-4xl">My collections</div>
      <div className="flex min-h-[320px]">
        {connected && address ? <CollectionsBase /> : null}
      </div>
    </div>
  )
}

const CollectionsBase = () => {
  const { nfts, loading } = useNfts()
  console.log(nfts)

  return (
    <Loading isLoading={loading}>
      <>
        {nfts.map((nft) =>
          'fields' in nft.data ? (
            <div key={nft.data.fields.id.id}>
              <img
                height={32}
                src={
                  (nft.data.fields.url as string)?.startsWith('http')
                    ? nft.data.fields.url
                    : rawIpfsToUrl(nft.data.fields.url)
                }
                width={32}
              />
            </div>
          ) : null
        )}
      </>
    </Loading>
  )
}

export default CollectionsWrapper
