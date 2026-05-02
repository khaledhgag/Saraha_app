import { AppError } from "../common/error/app.error.js";

export const validate = (schema = {}) => {
    return (req, res, next) => {
        const validationErrors = [];

        for (const key of ["body", "params", "query", "headers"]) {
            if (!schema[key]) {
                continue;
            }

            const { error, value } = schema[key].validate(req[key], {
                abortEarly: false,
                allowUnknown: key === "headers",
            });

            if (error) {
                validationErrors.push(...error.details.map((detail) => detail.message));
                continue;
            }

            req[key] = value;
        }

        if (validationErrors.length) {
            return next(new AppError(validationErrors.join(" , "), 400));
        }

        next();
    };
};
