import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export type AuthToken = JWT & {
  oauth_token: string
  oauth_token_secret: string
  user: User
}

export type SessionType = {
  session: ExtendedSession
  token: AuthToken
}

export type ExtendedSession = Session & {
  user: User
  oauth_token: string
  oauth_token_secret: string
}
