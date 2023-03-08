import { gql } from '@apollo/client'

const LOGIN_VERIFY = gql`
  mutation LoginVerify($input: LoginVerifyInput!) {
    loginVerify(input: $input) {
      accessToken
    }
  }
`

export default LOGIN_VERIFY
