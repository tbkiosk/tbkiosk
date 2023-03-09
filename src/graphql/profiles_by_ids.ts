import { gql } from '@apollo/client'

const PROFILES_BY_IDS = gql`
  query profilesByIDs($profileIDs: [ProfileID!]!, $myAddress: AddressEVM!) {
    profilesByIDs(profileIDs: $profileIDs) {
      handle
      profileID
      metadata
      avatar
      isSubscribedByMe(me: $myAddress)
      externalMetadataInfo {
        type
        verifiedTwitterID
        organization {
          cmcTokenId
          sector
          networks
        }
        personal {
          verifiedDiscordID
          title
          organization {
            id
            handle
            name
            avatar
          }
        }
        section {
          type
          name
        }
      }
    }
  }
`

export default PROFILES_BY_IDS
