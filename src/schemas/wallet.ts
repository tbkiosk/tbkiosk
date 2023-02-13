import Joi from "joi";

const schema = Joi.object({
  external_wallet_flag: Joi.boolean().required(),
  address: Joi.string().required(),
  email: Joi.string().required(),
  mnemonics: Joi.string().allow(null),
  password: Joi.string().allow(null),
  isActivated: Joi.boolean().required(),
});

export type Wallet = {
  address: string;
  email: string;
  external_wallet_flag: boolean;
  isActivated: boolean;
  mnemonics: string | null;
  password: string | null;
};

export default schema;
