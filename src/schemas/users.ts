import { z } from 'zod'

export const USERS_TABLE = 'users'

export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  image: z.string().optional(),
  emailVerified: z.boolean().optional(),
})
