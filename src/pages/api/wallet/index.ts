import { getServerSession } from 'next-auth/next'

import clientPromise from '@/lib/mongodb'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import walletSchema from '@/schemas/wallet'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { ResponseBase } from '@/pages/api/types'
import type { Wallet } from '@/schemas/wallet'
import type { ExtendedSession } from '@/helpers/nextauth/types'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseBase<Wallet>>
) => {
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as ExtendedSession
  if (!session) {
    return res.status(401)
  }

  if (!session.user?.email) {
    return res.status(500).json({
      message: 'Missing user email in session, try to sign out and login',
    })
  }

  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<Wallet>('wallets')

  /**
   * @method GET
   * @returns wallet referred to the email in session, return undefined if not found
   */
  if (req.method === 'GET') {
    const wallet = await collection
      .find({ email: session.user.email as string })
      .toArray()
    if (wallet.length > 1) {
      return res.status(500).json({
        message:
          'More than one wallets were found. Please contact Morphis admin',
      })
    }

    return res.status(200).json({ data: wallet[0] })
  }

  /**
   * @method POST
   * @param email string
   * @param address address
   * @returns created wallet, of which external_wallet_flag is true
   */
  if (req.method === 'POST') {
    const { email, address } = req.body

    if (
      !walletSchema.validate({
        email,
        address,
        external_wallet_flag: true,
      })
    ) {
      return res.status(400).json({
        message: 'Invalid email or address',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: `${email} is not the email signed in`,
      })
    }

    const wallet = await collection
      .find({ email: session.user.email as string })
      .toArray()
    if (wallet.length > 0) {
      return res.status(400).json({
        message: `You have already linked wallet of which the address is ${wallet[0].address}`,
      })
    }

    const walletModel: Wallet = {
      email,
      address,
      external_wallet_flag: true,
      mnemonics: null,
      password: null,
      isActivated: true,
    }

    try {
      collection.insertOne(walletModel)
    } catch (e) {
      return res.status(500).json({
        message: (e as Error).message,
      })
    }

    return res.status(200).json({ data: walletModel })
  }

  return res.status(501).end()
}

export default handler
