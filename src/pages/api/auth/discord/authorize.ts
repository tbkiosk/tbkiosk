import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { env } from '@/env.mjs'

import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<string | null>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json('Not authenticated')
  }

  if (!session.userId) {
    return res.status(500).json('Internal server error, no userId')
  }

  if (req.method === 'GET') {
    const search = new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      prompt: 'consent',
      response_type: 'code',
      scope: 'identify email guilds',
      state: Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join(''), // a random string to prevent CSRF attacks
      redirect_uri: `${env.NEXTAUTH_URL}/api/auth/discord/token`,
    })

    return res.redirect(`https://discord.com/oauth2/authorize?${search}`)
  }

  return res.status(405).json('Method not allowed')
}

export default handler
