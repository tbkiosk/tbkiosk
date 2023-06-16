import NextAuth from 'next-auth'
import { getCsrfToken } from 'next-auth/react'
import CredentialsProvider from 'next-auth/providers/credentials'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { SiweMessage } from 'siwe'

import { prismaClient } from '@/lib/prisma'
import { env } from '@/env.mjs'

import type { AuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismaClient) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(env.NEXTAUTH_URL)
          const csrfToken = await getCsrfToken({ req: { headers: req?.headers } })

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: csrfToken,
          })

          if (!result?.success) {
            throw new Error(result.error?.type || 'Failed to verify signature')
          }

          const address = result.data.address
          if (!address) {
            throw new Error('Address not found')
          }

          const _account = await prismaClient.account.findFirst({
            where: {
              providerAccountId: address,
            },
            select: {
              userId: true,
              providerAccountId: true,
              user: {
                select: {
                  image: true,
                  name: true,
                },
              },
            },
          })

          if (_account) {
            return {
              id: _account.userId,
              name: _account.user.name,
              image: _account.user.image,
            }
          }

          // if no existing user found, create a new one
          const user = await prismaClient.$transaction(async () => {
            const user = await prismaClient.user.create({
              data: {
                address,
                name: address,
                image: null,
              },
            })
            await prismaClient.account.create({
              data: {
                userId: user.id,
                type: 'credentials',
                provider: 'Ethereum',
                providerAccountId: address,
                isPrimary: true,
              },
            })

            return user
          })

          return {
            id: user.id,
            name: user.address,
          }
        } catch (e) {
          console.error(e)
          return null
        }
      },
    }),
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: '2.0',
      authorization: {
        params: {
          scope: 'users.read tweet.read follows.read like.read offline.access',
          state: Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join(''), // a random string to prevent CSRF attacks
          code_challenge_method: 's256',
        },
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
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
  debug: process.env.NODE_ENV === 'development',
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  events: {
    signIn: async ({ account, profile }) => {
      if (account && (account.provider === 'twitter' || account.provider === 'discord')) {
        await prismaClient.account.update({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          data: {
            providerAccountName: profile?.name,
          },
        })
      }
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (session?.user) {
        return { ...session, user: { ...session.user, id: token.id } }
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
