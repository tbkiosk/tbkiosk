import NextAuth, { type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import clientPromise from '@/lib/mongodb'

import refreshDiscordAccessToken from '@/helpers/nextauth/refreshDiscordToken'
import updateUserByProvider from '@/helpers/nextauth/updateUserByProvider'

import type { AuthToken, SessionType } from '@/helpers/nextauth/types'

export const authOptions: NextAuthOptions = {
  providers: [
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
  secret: process.env.JWT_SECRET as string,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      // Initial sign in
      if (account && user) {
        // update user discord or twitter email in users collection
        await updateUserByProvider({ account, user })

        return {
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at || 0) * 1000,
          refreshToken: account.refresh_token,
          provider: account.provider,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (!token?.accessTokenExpires || Date.now() < token.accessTokenExpires) {
        return token
      }

      return await refreshDiscordAccessToken(token as AuthToken)
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    session: async ({ session, token }: SessionType) => {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },
  pages: {
    signIn: '/',
  },
}

export default NextAuth(authOptions)
