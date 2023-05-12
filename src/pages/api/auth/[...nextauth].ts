import NextAuth, { type NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import clientPromise from '@/lib/mongodb'

import type { SessionType, ExtendedSession } from '@/types/nextauth'

if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
  throw new Error('Invalid/Missing Twitter client ID or client secret')
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Invalid/Missing next auth secret')
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: ({ token, account, user }) => {
      /**
       * if jwt callback has account and user, it means
       * it is to create a new user account. for Twitter oauth 1.0A,
       * there is oauth_token and oauth_token_secret. put them into
       * session for further Twitter API calls
       */
      if (account && user) {
        if (!account.oauth_token || !account.oauth_token_secret) {
          throw new Error('missing oauth_token or oauth_token_secret')
        }

        return {
          oauth_token: account.oauth_token as string,
          oauth_token_secret: account.oauth_token_secret as string,
          user,
        }
      }

      return token
    },
    session: ({ session, token }: SessionType): ExtendedSession => ({
      ...session,
      user: token.user,
      oauth_token: token.oauth_token,
      oauth_token_secret: token.oauth_token_secret,
    }),
  },
  pages: {
    signIn: '/',
  },
}

export default NextAuth(authOptions)
