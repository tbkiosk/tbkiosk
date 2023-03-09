import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import { stringToPinataURL } from '@/utils/ipfs'

type MetaData = {
  name: string
  bio: string
}

const CCPrimaryProfile = () => {
  const { primaryProfile } = useContext(CyberConnectAuthContext)

  const [metaData, setMetaData] = useState<MetaData>({
    name: '',
    bio: '',
  })

  const fetchMetaData = async (metadata: string) => {
    setMetaData({
      name: '',
      bio: '',
    })

    try {
      const res = await fetch(stringToPinataURL(metadata))
      if (res.status === 200) {
        const data = await res.json()
        setMetaData(data)
      }
    } catch (err) {
      toast((err as Error)?.message || 'Failed to fetch cyberconnect metadata')
    }
  }

  useEffect(() => {
    if (!primaryProfile?.metadata) {
      return
    }

    fetchMetaData(primaryProfile.metadata)
  }, [primaryProfile?.metadata])

  return (
    <div className="h-48 flex flex-row items-center shrink-0">
      <div className="h-40 w-40 flex items-center justify-center p-4 mr-4 bg-[#fff3ec] rounded-lg">
        {primaryProfile?.avatar && (
          <Image
            alt="avatar"
            height={164}
            src={primaryProfile.avatar}
            width={164}
          />
        )}
      </div>
      <div className="flex flex-col">
        <p>{metaData?.name}</p>
        <p className="font-bold text-4xl">@{primaryProfile?.handle}</p>
        <p>{metaData.bio}</p>
      </div>
    </div>
  )
}

export default CCPrimaryProfile
