import Joi from "joi";
const createInvoiceSchema = Joi.object({
  amount: Joi.number().required(),
  due_date: Joi.date().required(),
});

export { createInvoiceSchema };
