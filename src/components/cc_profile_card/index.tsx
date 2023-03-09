import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { useMutation, useLazyQuery } from '@apollo/client'
// import { useEvmWalletNFTs } from '@moralisweb3/next'
import cl from 'classnames'

import { Button } from '@/components'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'
import { CREATE_SUBSCRIBE_TYPED_DATA, RELAY, RELAY_ACTION_STATUS } from '@/graphql'
import { ellipsisMiddle } from '@/utils/address'

import st from './styles.module.css'

export type Profile = {
  handle: string
  avatar: string
  metadata: string
  profileID: number
  isSubscribedByMe: boolean
  owner: {
    address: string
  }
}

type CCProfileCardProps = Profile & {
  classNames?: string
}

export const CCProfileCard = ({ handle, avatar, profileID, isSubscribedByMe, owner: { address } }: CCProfileCardProps) => {
  const { accessToken, connectWallet, checkNetwork } = useContext(CyberConnectAuthContext)

  const [createSubscribeTypedData] = useMutation(CREATE_SUBSCRIBE_TYPED_DATA)
  const [relay] = useMutation(RELAY)
  const [getRelayActionStatus] = useLazyQuery(RELAY_ACTION_STATUS)

  const [isSubscribing, setIsSubscribing] = useState(false)

  const onSubscribe = async (profileID: number) => {
    setIsSubscribing(true)

    try {
      if (!accessToken) {
        throw Error('You need to Sign in.')
      }

      const provider = await connectWallet()
      await checkNetwork(provider)
      const signer = provider.getSigner()
      const address = await signer.getAddress()

      const typedDataResult = await createSubscribeTypedData({
        variables: {
          input: {
            profileIDs: [profileID],
          },
        },
      })
      const typedData = typedDataResult.data?.createSubscribeTypedData?.typedData
      const message = typedData.data
      const typedDataID = typedData.id

      /* Get the signature for the message signed with the wallet */
      const fromAddress = address
      const params = [fromAddress, message]
      const method = 'eth_signTypedData_v4'
      const signature = await signer.provider.send(method, params)

      /* Call the relay to broadcast the transaction */
      const relayResult = await relay({
        variables: {
          input: {
            typedDataID: typedDataID,
            signature: signature,
          },
        },
      })
      const relayActionId = relayResult.data?.relay?.relayActionId

      if (relayActionId) {
        await getRelayActionStatus({
          variables: { relayActionId },
          fetchPolicy: 'network-only',
        })
      }

      toast.success(`Subscribed to profile!`)
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to subscribe')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="h-96 px-16 py-12 flex flex-col items-center gap-6 rounded-lg shadow-[0_4px_10px_rgba(165,165,165,0.25)]">
      <div className="h-16 w-16 flex items-center justify-center shrink-0 bg-[#fff3ec] rounded-full overflow-hidden">
        {avatar?.startsWith('http') && (
          <Image
            alt="avatar"
            height={64}
            src={avatar}
            width={64}
          />
        )}
      </div>
      <div className="text-center">
        <p>@{handle}</p>
        <p className="text-sm text-gray-500">{ellipsisMiddle(address)}</p>
      </div>
      <p className="text-center text-gray-500">
        <i className="fa-brands fa-twitter mr-8 cursor-not-allowed" />
        <i className="fa-brands fa-discord cursor-not-allowed" />
      </p>
      <NftRow address={address} />
      <div className="grow" />
      <Button
        className={cl(['!w-32 !text-white !border-none', !isSubscribedByMe && st.button])}
        disabled={isSubscribedByMe}
        loading={isSubscribing}
        onClick={() => onSubscribe(profileID)}
        variant="outlined"
      >
        {isSubscribedByMe ? 'Followed' : 'Follow'}
      </Button>
    </div>
  )
}

type NftRowProps = {
  address: string
}

const NftRow = ({ address }: NftRowProps) => {
  if (!address) {
    return null
  }

  // const { isFetching: ethNftLoading, data: ethNftObjects } = useEvmWalletNFTs({
  //   address,
  //   format: 'decimal',
  //   limit: 50,
  //   chain: 0x1,
  // })
  // const { isFetching: polygonNftLoading, data: polygonNftObjects } = useEvmWalletNFTs({
  //   address,
  //   format: 'decimal',
  //   limit: 50,
  //   chain: 0x89,
  // })

  return <div></div>
}
