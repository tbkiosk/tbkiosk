import { z } from 'zod'

export const USERS_TABLE = 'users'

export const UserSchema = z.object({
  primary_address: z.object({
    chain: z.enum(['ETH', 'SUI']),
    address: z.string(),
  }),
  addresses: z.array(
    z.object({
      chain: z.enum(['ETH', 'SUI']),
      address: z.string(),
    })
  ),
  twitter: z
    .object({
      access_token: z.string(),
    })
    .nullable(),
  discord: z
    .object({
      access_token: z.string(),
    })
    .nullable(),
})

enum Chains {
  ETH = 'ETH',
  SUI = 'SUI',
}

export type Address = {
  chain: Chains
  address: string
}

type OAuth = {
  access_token: string
  refresh_token: string
  expires_at: number
}

export type User = {
  primary_address: Address
  addresses: Address[]
  created_at: Date
  updated_at: Date
  twitter: OAuth | null
  discord: OAuth | null
}
