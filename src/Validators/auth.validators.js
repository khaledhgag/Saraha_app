import Joi from "joi";
import { GENDER } from "../Common/index.js";
import { generalValidators } from "../Common/validators/general.validators.js";


export const registerSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(50),
        lastName: Joi.string().min(2).max(50),
        email: generalValidators.email,
        password:generalValidators.password,
        confirmPassword: Joi.valid( Joi.ref('password')),
        gender: Joi.string().valid(...Object.values(GENDER)),
        phonenumber: Joi.string().min(10).max(20),
    })
    .with('email' , 'password')
    .with('password', 'confirmPassword')
    .options({presence:'required'})
}

export const loginSchema = {
    body: Joi.object({
        email: generalValidators.email.required(),
        password: Joi.string().required(),
    }),
};

export const gmailSchema = {
    body: Joi.object({
        idToken: Joi.string().min(20).required(),
    }),
};

export const revokeTokenSchema = {
    body: Joi.object({
        token: Joi.string().min(20).required(),
        email: generalValidators.email,
    }),
};
