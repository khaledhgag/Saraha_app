import jwt from "jsonwebtoken";
import envconfig from "../config/env.config.js";
import { AppError } from "../common/error/app.error.js";
import { revokedTokenRepo } from "../DB/Repositorries/Index.js";

const jwtsecret = envconfig.JWT;

const extractToken = (authorization = "") => {
    if (!authorization) {
        return null;
    }

    if (authorization.startsWith("Bearer ")) {
        return authorization.split(" ")[1];
    }

    return authorization;
};

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            throw new AppError("Authorization token is required", 401);
        }

        if (!jwtsecret.ACCESS_SECRET) {
            throw new AppError("JWT_ACCESS_SECRET is missing from environment variables", 500);
        }

        const revokedToken = await revokedTokenRepo.findOneDocument({ token });
        if (revokedToken) {
            throw new AppError("Token has been revoked", 401);
        }

        const decoded = jwt.verify(token, jwtsecret.ACCESS_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
};
