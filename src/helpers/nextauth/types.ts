import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { ExtendedUser } from '@/schemas/user'

export type AuthToken = JWT & {
  accessToken: string
  accessTokenExpires: string
  refreshToken: string
  user: ExtendedUser
  error?: string
}

export type SessionType = {
  session: ExtendedSession
  token: AuthToken
}

export type ExtendedSession = Session & {
  provider?: string
  accessToken?: string
  error?: string
}
