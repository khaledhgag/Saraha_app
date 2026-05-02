import Joi from "joi";
import { GENDER } from "../Common/index.js";
import { generalValidators } from "../Common/validators/general.validators.js";

export const createUserSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: generalValidators.email.required(),
        password: generalValidators.password.required(),
        gender: Joi.string().valid(...Object.values(GENDER)),
        phonenumber: Joi.string().min(10).max(20),
    }),
};

export const updateUserSchema = {
    params: Joi.object({
        id: generalValidators._id.required(),
    }),
    body: Joi.object({
        firstName: Joi.string().min(3).max(50),
        lastName: Joi.string().min(3).max(50),
        email: generalValidators.email,
        password: generalValidators.password,
        gender: Joi.string().valid(...Object.values(GENDER)),
        phonenumber: Joi.string().min(10).max(20),
    }).min(1),
};

export const userIdSchema = {
    params: Joi.object({
        id: generalValidators._id.required(),
    }),
};

export const getUserMessagesSchema = {
    params: Joi.object({
        id: generalValidators._id.required(),
    }),
    query: Joi.object({
        skip: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(1).max(100),
    }),
};
