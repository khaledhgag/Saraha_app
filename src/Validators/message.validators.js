import Joi from "joi";
import { generalValidators } from "../Common/validators/general.validators.js";

export const createMessageSchema = {
    body: Joi.object({
        content: Joi.string().min(1).max(2000).required(),
        receiverId: generalValidators._id.required(),
    }),
};

export const updateMessageSchema = {
    params: Joi.object({
        id: generalValidators._id.required(),
    }),
    body: Joi.object({
        content: Joi.string().min(1).max(2000),
        receiverId: generalValidators._id,
    }).min(1),
};

export const messageIdSchema = {
    params: Joi.object({
        id: generalValidators._id.required(),
    }),
};

export const getMessagesSchema = {
    query: Joi.object({
        receiverId: generalValidators._id,
        skip: Joi.number().integer().min(0),
        limit: Joi.number().integer().min(1).max(100),
    }),
};
