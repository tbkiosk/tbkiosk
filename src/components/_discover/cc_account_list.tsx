import { useContext, useState, useEffect } from 'react'
// import { toast } from 'react-toastify'
import { useLazyQuery } from '@apollo/client'

import { CCProfileCard } from '@/components'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import { PROFILES_BY_IDS } from '@/graphql'

import type { Profile } from '../cc_profile_card'

const FIXED_PROFILE_ID = [7, 12, 15, 72]

const CCAccountList = () => {
  const { accessToken, address } = useContext(CyberConnectAuthContext)
  const [getProfilesByIDs] = useLazyQuery(PROFILES_BY_IDS)

  const [profiles, setProfiles] = useState<Profile[]>([])

  const getProfiles = async () => {
    try {
      const { data } = await getProfilesByIDs({
        variables: {
          profileIDs: [
            ...FIXED_PROFILE_ID,
            ...Array(4)
              .fill(undefined)
              .map(() => Math.ceil(Math.random() * 100))
              .filter(profileID => !FIXED_PROFILE_ID.includes(profileID)),
          ],
          myAddress: address,
        },
      })

      setProfiles([...(data?.profilesByIDs || [])])
    } catch (err) {
      console.error(err)
      // TODO: keep throwing signal is aborted without reason. try to figure out
      // toast.error((err as Error)?.message || 'Failed to fetch account list')
    }
  }

  useEffect(() => {
    if (accessToken && address) {
      getProfiles()
    }
  }, [accessToken, address])

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
