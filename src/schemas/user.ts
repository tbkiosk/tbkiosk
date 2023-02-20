import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  image: Joi.string(),
  emailVaerified: Joi.boolean().allow(null),
  discordEmail: Joi.string().allow(undefined),
  twitterEmail: Joi.string().allow(undefined),
})

export type ExtendedUser = {
  name: string
  email: string
  image: string | undefined
  emailVaerified: boolean | null
  discordEmail?: string
  twitterEmail?: string
}

export default schema
