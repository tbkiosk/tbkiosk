import type { ObjectId } from 'mongodb'
import type { Account } from 'next-auth'

export const ACCOUNTS_TABLE = 'accounts'

export type AccountData = Omit<Account, 'userId'> & {
  userId: ObjectId
  discord_access_token?: string
}
