import clientPromise from '@/lib/mongodb'

import type { Account, User } from 'next-auth'
import type { ExtendedUser } from '@/schemas/user'

type UpdateUserByProvider = {
  account: Account
  user: User
}

const updateUserByProvider = async ({
  account,
  user,
}: UpdateUserByProvider) => {
  const client = await clientPromise
  const db = client.db(`${process.env.NODE_ENV}`)
  const collection = db.collection<ExtendedUser>('users')

  const provider = account.provider
  const email = user.email

  if (!provider || !email) {
    return
  }

  const targetUser = await collection.findOne({ email })
  if (
    !targetUser ||
    targetUser.discordEmail === email ||
    targetUser.twitterEmail === email
  ) {
    return
  }

  collection.updateOne(
    { email },
    {
      $set: {
        [provider === 'discord' ? 'discordEmail' : 'twitterEmail']: email,
      },
    }
  )
}

export default updateUserByProvider
