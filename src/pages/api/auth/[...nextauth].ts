import NextAuth from 'next-auth'
import { getCsrfToken } from 'next-auth/react'
import CredentialsProvider from 'next-auth/providers/credentials'
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { SiweMessage } from 'siwe'

import { prismaClient } from '@/lib/prisma'
import { env } from '@/env.mjs'
import { generateCodeChallenge } from '@/utils/pkce'

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

          const target = await prismaClient.account.findFirst({
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

          if (target) {
            return {
              id: target.userId,
              name: target.user.name,
              image: target.user.image,
            }
          }

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
          code_challenge: generateCodeChallenge(),
          code_challenge_method: 'S256',
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session: ({ session }) => session,
  },
}

export default NextAuth(authOptions)
