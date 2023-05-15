import { object, string, bool } from 'yup'

export const USERS_TABLE = 'users'

export const UserSchema = object({
  _id: string(),
  name: string().required(),
  email: string().required(),
  image: string(),
  emailVerified: bool(),
})
