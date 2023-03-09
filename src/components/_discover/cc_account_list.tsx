import { useContext, useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { CCProfileCard } from '@/components'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import { PROFILES_BY_IDS } from '@/graphql'

import type { Profile } from '../cc_profile_card'

const CCAccountList = () => {
  const { accessToken, address } = useContext(CyberConnectAuthContext)
  const [getProfilesByIDs] = useLazyQuery(PROFILES_BY_IDS)

  const [profiles, setProfiles] = useState<Profile[]>([])

  const getProfiles = async () => {
    const { data } = await getProfilesByIDs({
      variables: {
        profileIDs: Array(7)
          .fill(undefined)
          .map(() => Math.ceil(Math.random() * 100)),
        myAddress: address,
      },
    })
    setProfiles([...(data?.profilesByIDs || [])])
  }

  useEffect(() => {
    if (accessToken && address) {
      getProfiles()
    }
  }, [accessToken, address, getProfilesByIDs])

  return (
    <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4">
      {profiles.map(profile => (
        <CCProfileCard
          key={profile.profileID}
          {...profile}
        />
      ))}
    </div>
  )
}

export default CCAccountList
