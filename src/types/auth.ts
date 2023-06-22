export type OAuth2TokenRefreshResponse = {
  token_type: string
  expires_in: number
  access_token: string
  scope: string
  refresh_token: string
}

export type AuthMessage = {
  domain: string
  address: string
  statement: string
  uri: string
  nonce: string | undefined
}
