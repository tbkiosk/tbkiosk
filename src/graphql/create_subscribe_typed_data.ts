import { gql } from '@apollo/client'

const CREATE_SUBSCRIBE_TYPED_DATA = gql`
  mutation CreateSubscribeTypedData($input: CreateSubscribeTypedDataInput!) {
    createSubscribeTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`

export default CREATE_SUBSCRIBE_TYPED_DATA
