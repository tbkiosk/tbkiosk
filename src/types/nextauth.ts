import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export type AuthToken = JWT & {
  twitter_access_token: string
  user: User
}

export type SessionType = {
  session: ExtendedSession
  token: AuthToken
}

export type ExtendedSession = Session & {
  user: User
  twitter_access_token: string
}

export type OAuthRes = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}
