import Joi from "joi";

export const GameSchema = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.string().min(3).required(),
    stockTotal: Joi.number().required(),
    pricePerDay: Joi.number().required()
});
