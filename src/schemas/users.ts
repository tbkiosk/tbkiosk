import { z } from 'zod'

export const USERS_TABLE = 'users'

export const UserSchema = z.object({
  _id: z.string(),
  addresses: z.array(
    z.object({
      chain: z.enum(['ETH', 'SUI']),
      address: z.string(),
    })
  ),
})

enum Chains {
  ETH = 'ETH',
  SUI = 'SUI',
}

type Address = {
  chain: Chains
  address: string
}

export type User = {
  addresses: Address[]
}
