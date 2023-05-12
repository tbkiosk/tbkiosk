import 'next-auth'

import type { User } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: User
    oauth_token: string
    oauth_token_secret: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User
    oauth_token: string
    oauth_token_secret: string
  }
}
