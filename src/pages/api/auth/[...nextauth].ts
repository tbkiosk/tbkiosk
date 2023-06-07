import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@auth/prisma-adapter'

import prisma from '@/lib/prisma'
import { env } from '@/env.mjs'
import { generateCodeChallenge } from '@/utils/pkce'

import type { AuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
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
  secret: env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
