import Joi from "joi";

export const CustomersSchema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(11).required(),
    cpf: Joi.string().min(11).required(),
    birthday: Joi.string().min(10).required()
});