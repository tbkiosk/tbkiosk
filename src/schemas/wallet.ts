import Joi from "joi";

const schema = Joi.object({
  external_wallet_flag: Joi.boolean().required(),
  address: Joi.string().required(),
});

export type Wallet = {
  external_wallet_flag: boolean;
  address: string;
};

export default schema;
