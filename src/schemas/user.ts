import { object, string, bool } from 'yup'

export const USER_TABLE = 'user'

export const UserSchema = object({
  _id: string(),
  name: string().required(),
  email: string().required(),
  image: string(),
  emailVerified: bool(),
})
