import type { ObjectId } from 'mongodb'
import type { Account } from 'next-auth'

export const ACCOUNTS_TABLE = 'accounts'

export type AccountData = Omit<Account, 'userId'> & {
  userId: ObjectId
  discord_access_token?: string
  discord_refresh_token?: string
  discord_expires_at?: number
  discord_scope?: string
  discord_token_type?: string
}
