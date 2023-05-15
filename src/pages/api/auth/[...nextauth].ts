import NextAuth, { type NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import clientPromise from '@/lib/mongodb'

import { generateCodeChallenge } from '@/utils/pkce'

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
      version: '2.0',
      authorization: {
        params: {
          scope: 'users.read tweet.read follows.read like.read offline.access',
          state: Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join(''), // a random string to prevent CSRF attacks
          code_challenge: generateCodeChallenge(),
          code_challenge_method: 'S256',
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          grant_type: 'authorization_code',
          response_type: 'code',
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: ({ token, account, user, trigger }) => {
      if (trigger === 'signUp') {
        switch (account?.provider) {
          case 'twitter': {
            if (!account.access_token) {
              throw new Error('missing Twitter access_token')
            }

            return {
              twitter_access_token: account.access_token as string,
              user,
            }
          }
          case 'discord': {
            break
          }
          default: {
            break
          }
        }
      }

      return token
    },
    session: ({ session, token }: SessionType): ExtendedSession => ({
      ...session,
      user: token.user,
      twitter_access_token: token.twitter_access_token,
    }),
  },
  pages: {
    signIn: '/',
  },
}

export default NextAuth(authOptions)
