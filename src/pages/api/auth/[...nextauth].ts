import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from 'next-auth/providers/discord'
import { ObjectId } from 'mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import clientPromise from '@/lib/mongodb'

import { generateCodeChallenge } from '@/utils/pkce'
import request from '@/utils/request'

import { ACCOUNTS_TABLE } from '@/schemas/accounts'

import type { NextAuthOptions, Session, TokenSet } from 'next-auth'
import type { AccountData } from '@/schemas/accounts'

if (!process.env.TWITTER_CLIENT_ID || !process.env.TWITTER_CLIENT_SECRET) {
  throw new Error('Invalid/Missing Twitter client ID or client secret')
}

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  throw new Error('Invalid/Missing Discord client ID or client secret')
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Invalid/Missing next auth secret')
}

export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * Twitter OAuth2 expires_at is in seconds. remember to * 1000
     */
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
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          grant_type: 'authorization_code',
          response_type: 'code',
          scope: 'identify email guilds',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/connect`,
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, user }): Promise<Session> => {
      try {
        const client = await clientPromise
        const db = client.db(`${process.env.NODE_ENV}`)
        const collection = db.collection<AccountData>(ACCOUNTS_TABLE)

        const _account = await collection.findOne({
          userId: new ObjectId(user.id),
          provider: 'twitter',
        })
        if (!_account) {
          throw new Error('Account not found')
        }

        if (((_account.expires_at as number) || 0) * 1000 > Date.now()) {
          return { ...session, userId: user.id }
        }

        const res = await refreshTwitterAccessToken(_account.refresh_token as string)
        if (!res?.data?.access_token || !res?.data?.refresh_token || !res?.data?.expires_in) {
          console.error(res?.message || 'Failed to refresh access token')
          throw new Error('Failed to refresh access token')
        }

        await collection.updateOne(
          {
            userId: new ObjectId(user.id),
            provider: 'twitter',
          },
          {
            $set: {
              access_token: res.data.access_token as string,
              refresh_token: res.data.refresh_token as string,
              expires_at: Math.floor(Date.now() / 1000) + (res.data.expires_in || 0), // expires_in and expires_at are in seconds, Date.now() is in milliseconds. Parses to seconds
            },
          }
        )
      } catch (error) {
        console.error(error)
        return {
          ...session,
          error: 'RefreshAccessTokenError',
        }
      }

      return { ...session, userId: user.id }
    },
  },
}

export default NextAuth(authOptions)

const refreshTwitterAccessToken = async (refreshToken: string) => {
  const res = await request<Omit<TokenSet, 'expires_at'> & { expires_in?: number }>({
    url: 'https://api.twitter.com/2/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${process.env.TWITTER_CLIENT_ID as string}:${process.env.TWITTER_CLIENT_SECRET as string}`)}`,
    },
    data: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  return res
}
