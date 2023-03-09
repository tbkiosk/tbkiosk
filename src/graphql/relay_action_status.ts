import { gql } from '@apollo/client'

const RELAY_ACTION_STATUS = gql`
  query RelayActionStatus($relayActionId: ID!) {
    relayActionStatus(relayActionId: $relayActionId) {
      ... on RelayActionStatusResult {
        txHash
        txStatus
      }
      ... on RelayActionError {
        reason
        lastKnownTxHash
      }
      ... on RelayActionQueued {
        queuedAt
      }
    }
  }
`

export default RELAY_ACTION_STATUS
