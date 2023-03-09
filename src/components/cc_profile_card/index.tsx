import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { useMutation } from '@apollo/client'
import cl from 'classnames'

import { Button } from '@/components'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import { CREATE_SUBSCRIBE_TYPED_DATA, RELAY } from '@/graphql'

import st from './styles.module.css'

export type Profile = {
  handle: string
  avatar: string
  metadata: string
  profileID: number
  isSubscribedByMe: boolean
}

type CCProfileCardProps = Profile & {
  classNames?: string
}

export const CCProfileCard = ({ handle, avatar, profileID, isSubscribedByMe }: CCProfileCardProps) => {
  const { accessToken, connectWallet, checkNetwork } = useContext(CyberConnectAuthContext)

  const [createSubscribeTypedData] = useMutation(CREATE_SUBSCRIBE_TYPED_DATA)
  const [relay] = useMutation(RELAY)

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
      const txHash = relayResult.data?.relay?.relayTransaction?.txHash || ''

      toast.success(`Subscribed to profile! Hash: ${txHash}`)
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to subscribe')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="h-96 px-16 py-12 flex flex-col items-center gap-6 rounded-lg shadow-[0_4px_10px_rgba(165,165,165,0.25)]">
      <div className="h-16 w-16 flex items-center justify-center bg-[#fff3ec] rounded-full overflow-hidden">
        {avatar?.startsWith('http') && (
          <Image
            alt="avatar"
            height={64}
            src={avatar}
            width={64}
          />
        )}
      </div>
      <p>@{handle}</p>
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
