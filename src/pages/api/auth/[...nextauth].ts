import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { Collection, ObjectId } from 'mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

import clientPromise from '@/lib/mongodb'

import { generateCodeChallenge } from '@/utils/pkce'
import request from '@/utils/request'

import { ACCOUNTS_TABLE } from '@/schemas/accounts'

import type { NextAuthOptions, Session, TokenSet, User } from 'next-auth'
import type { AccountData } from '@/schemas/accounts'
import { env } from '@/env.mjs'

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
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
  ],
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === 'development',
  secret: env.NEXTAUTH_SECRET,
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

        await refreshTwitterAccessToken({ account: _account, user, collection })
        await refreshDiscordAccessToken({ account: _account, user, collection })

        return { ...session, userId: user.id, error: undefined }
      } catch (error) {
        console.error(error)
        return {
          ...session,
          error: 'RefreshAccessTokenError',
        }
      }
    },
  },
}

export default NextAuth(authOptions)

type RefreshAccessToken = {
  account: AccountData
  collection: Collection<AccountData>
  user: User
}

const refreshTwitterAccessToken = async ({ account, collection, user }: RefreshAccessToken) => {
  if (((account.expires_at as number) || 0) * 1000 > Date.now()) return

  const res = await request<Omit<TokenSet, 'expires_at'> & { expires_in?: number }>({
    url: 'https://api.twitter.com/2/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`)}`,
    },
    data: new URLSearchParams({
      refresh_token: account.refresh_token as string,
      grant_type: 'refresh_token',
    }),
  })

  if (!res?.data?.access_token || !res?.data?.refresh_token || !res?.data?.expires_in) {
    console.error(res?.message || 'Failed to Twitter refresh access token')
    throw new Error('Failed to refresh Twitter access token')
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
        /**
         * Twitter OAuth2 returns expires_at is in seconds. So expires_at in database is in seconds.
         * expires_in of token refresh is in seconds as well.
         * Date.now() is in milliseconds. Parses it to seconds to accord with expires_at in database.
         */
        expires_at: Math.floor(Date.now() / 1000) + (res.data.expires_in || 0),
      },
    }
  )
}

const refreshDiscordAccessToken = async ({ account, collection, user }: RefreshAccessToken) => {
  if (!account.discord_refresh_token) return

  if (((account.discord_expires_at as number) || 0) * 1000 > Date.now()) return

  const res = await request<Omit<TokenSet, 'expires_at'> & { expires_in?: number }>({
    url: 'https://discord.com/api/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${process.env.DISCORD_CLIENT_ID as string}:${process.env.DISCORD_CLIENT_SECRET as string}`)}`,
    },
    data: new URLSearchParams({
      refresh_token: account.discord_refresh_token as string,
      grant_type: 'refresh_token',
    }),
  })

  if (!res?.data?.access_token || !res?.data?.refresh_token || !res?.data?.expires_in) {
    console.error(res?.message || 'Failed to refresh Discord access token')
    throw new Error('Failed to refresh Discord access token')
  }

  await collection.updateOne(
    {
      userId: new ObjectId(user.id),
      provider: 'twitter', // We have only one account provider -- Twitter provider
    },
    {
      $set: {
        discord_access_token: res.data.access_token as string,
        discord_refresh_token: res.data.refresh_token as string,
        discord_expires_at: Math.floor(Date.now() / 1000) + (res.data.expires_in || 0),
      },
    }
  )
}
