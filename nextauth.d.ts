import 'next-auth'

type RefreshAccessTokenError = 'RefreshAccessTokenError'

declare module 'next-auth' {
  interface Session {
    userId?: string
    error?: RefreshAccessTokenError
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: RefreshAccessTokenError
  }
}
