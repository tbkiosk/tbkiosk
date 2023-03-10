import { useContext, useState, useEffect } from 'react'
// import { toast } from 'react-toastify'
import { useLazyQuery } from '@apollo/client'

import { CCProfileCard } from '@/components'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import { PROFILES_BY_IDS } from '@/graphql'

import type { Profile } from '../cc_profile_card'

const FIXED_PROFILE_ID = [7, 12, 15, 72]

const SUGGESTED_PROFILES = [
  {
    handle: 'ccprotocol',
    avatar: 'https://gateway.pinata.cloud/ipfs/QmNcqSpCvhiyHocUaVf7qB8qwEGerSpnELeAi567YEraYm',
    metadata: 'QmRiyArHF4abhXo4pdKVQj3fVg6jLvcnH4DitVijuTaoyq',
    profileID: 15,
    isSubscribedByMe: false,
    owner: {
      address: '0x5De3058D71FCCa15c8568Eb45857e3cdFb56D18d',
    },
  },
  {
    handle: 'cyberlab',
    avatar: 'https://gateway.pinata.cloud/ipfs/QmTMBsha6BjtNQqQFRjrpwQAfkt1DHpe5VTr2idw5piE47',
    profileID: 16,
    metadata: 'QmfQTU5eWfG1wwfC5k6enHtTZGNgRimqU5rvvt5Qp8GCyi',
    isSubscribedByMe: false,
    owner: {
      address: '0x5De3058D71FCCa15c8568Eb45857e3cdFb56D18d',
    },
  },
  {
    handle: 'snowdot',
    avatar: 'https://gateway.pinata.cloud/ipfs/QmV1ZVcyC96g1HYsxXgG6BP6Kc8xrZCBqj7PNkvxhPwLoz',
    profileID: 44,
    metadata: 'QmUoU9be1DGKUiVwEjvbw9dMRrRNK4TX7A57YL4NBe4hQa',
    isSubscribedByMe: false,
    owner: {
      address: '0x5De3058D71FCCa15c8568Eb45857e3cdFb56D18d',
    },
  },
  {
    handle: 'satoshi',
    avatar: 'https://gateway.pinata.cloud/ipfs/QmaGUuGqxJ29we67C7RbCHSQaPybPdfoNr8Zccd7pfw8et',
    profileID: 5,
    metadata: 'QmewyA1GAKFDs7wze3KuzwrUsJV3qmUA41jcpAuJNQpqTs',
    isSubscribedByMe: false,
    owner: {
      address: '0x5De3058D71FCCa15c8568Eb45857e3cdFb56D18d',
    },
  },
]

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

      setProfiles(SUGGESTED_PROFILES)
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
