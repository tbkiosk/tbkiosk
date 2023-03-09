import { gql } from '@apollo/client'

const RELAY = gql`
  mutation Relay($input: RelayInput!) {
    relay(input: $input) {
      relayActionId
    }
  }
`

export default RELAY
