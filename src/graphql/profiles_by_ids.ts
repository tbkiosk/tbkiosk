import { gql } from '@apollo/client'

const PROFILES_BY_IDS = gql`
  query profilesByIDs($profileIDs: [ProfileID!]!, $myAddress: AddressEVM!) {
    profilesByIDs(profileIDs: $profileIDs) {
      handle
      profileID
      metadata
      avatar
      isSubscribedByMe(me: $myAddress)
    }
  }
`

export default PROFILES_BY_IDS
