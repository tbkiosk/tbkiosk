import * as Joi from 'joi'

import type { User } from 'next-auth'

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  image: Joi.string(),
  emailVerified: Joi.boolean().allow(null),
  discordEmail: Joi.string().allow(undefined),
  twitterEmail: Joi.string().allow(undefined),
})

export type ExtendedUser = User & {
  discordEmail?: string
  twitterEmail?: string
}

export default schema
