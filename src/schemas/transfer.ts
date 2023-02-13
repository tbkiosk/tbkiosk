import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().required(),
});

export default schema;
