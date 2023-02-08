import Joi from "joi";

const schema = Joi.object({
  external_wallet_flag: Joi.boolean().required(),
  address: Joi.string().required(),
  email: Joi.string().required(),
});

export type Wallet = {
  address: string;
  email: string;
  external_wallet_flag: boolean;
};

export default schema;
