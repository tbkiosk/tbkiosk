import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/types/response'

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseBase<null> | null>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json(null)
  }

  if (!session?.userId) {
    return res.status(500).json({ message: 'No userId' })
  }

  if (req.method === 'GET') {
    // TODO
    // try to use alchemy to return some chain data of specific address, e.g. token or NFTs
  }

  return res.status(405).json(null)
}

export default handler
