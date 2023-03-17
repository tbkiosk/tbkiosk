import Joi from 'joi'

const schema = Joi.object({
  projectName: Joi.string().required(),
  customURL: Joi.string().required(),
  description: Joi.string(),
  website: Joi.string(),
  twitter: Joi.string(),
  discord: Joi.string(),
  mintDate: Joi.string(),
  mintPrice: Joi.string(),
  coinType: Joi.string(),
  totalSupply: Joi.string(),
})

export type Project = {
  projectName: string
  customURL?: string
  description?: string
  website?: string
  twitter?: string
  discord?: string
  mintDate?: string
  mintPrice?: string
  coinType?: string
  totalSupply?: string
}

export default schema
