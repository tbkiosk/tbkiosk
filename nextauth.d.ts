import 'next-auth'

import type { User } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: User
    twitter_access_token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User
    twitter_access_token: string
  }
}
