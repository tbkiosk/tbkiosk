import type { User, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export type AuthToken = JWT & {
  accessToken: string
  accessTokenExpires: string
  refreshToken: string
  user: User
  error?: string
}

export type SessionType = {
  session: ExtendedSession
  token: AuthToken
}

export type ExtendedSession = Session & {
  accessToken?: string
  error?: string
}
