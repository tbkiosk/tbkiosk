import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { ACCOUNTS_TABLE, type AccountData } from '@/schemas/accounts'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ExtendedSession } from '@/types/nextauth'
import request from '@/utils/request'

const handler = async (req: NextApiRequest, res: NextApiResponse<string | null>) => {
  const session: ExtendedSession | null = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json('Not authenticated')
  }

  if (!session.user?.id) {
    return res.status(500).json('Internal server error, no userId')
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<AccountData>(ACCOUNTS_TABLE)

  /**
   * @method GET
   * @returns created projects
   */
  if (req.method === 'GET') {
    const { code, state } = req.query
    if (!code || !state) {
      return res.status(500).json('Internal server error, failed to get oauth code or state')
    }

    console.log(7777, code, state)
    const oauthRes = await request('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.DISCORD_CLIENT_ID as string,
        client_secret: process.env.DISCORD_CLIENT_SECRET as string,
        grant_type: 'authorization_code',
        code,
        state,
      }),
    })
    console.log(7779, oauthRes)
    // await collection.updateOne(
    //   {
    //     userId: new ObjectId(session.user.id),
    //   },
    //   {
    //     $set: {
    //       discord: {},
    //     },
    //   }
    // )
    return res.redirect(307, '/login').json(null)
  }

  return res.status(405).json('Method not allowed')
}

export default handler
