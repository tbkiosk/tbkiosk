import { gql } from '@apollo/client'

const LOGIN_GET_MESSAGE = gql`
  mutation LoginGetMessage($input: LoginGetMessageInput!) {
    loginGetMessage(input: $input) {
      message
    }
  }
`
export default LOGIN_GET_MESSAGE
