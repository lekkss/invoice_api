import Joi from "joi";
const createClientSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export { createClientSchema };
