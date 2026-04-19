import { userRepo } from "../../DB/Repositorries/Index.js";
import {OAuth2Client}  from "google-auth-library";
import { AppError } from "../../common/error/app.error.js";
import { hash, compare } from "../../common/security/hash.js";
import { encrypt } from "../../Utils/encryption.utils.js";
import jwt from "jsonwebtoken";
import envconfig from "../../config/env.config.js";
import { prvidors } from "../../common/constants.js";
const jwtsecret = envconfig.JWT;
const normalizeEmail = (email = "") => email.trim().toLowerCase();
const gcp = envconfig.gcp;
 const client = new OAuth2Client();

const sanitizeUser = (user) => {
    const plainUser = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = plainUser;

    return safeUser;
};

export const register = async (data) => {
    const { firstName, lastName, email, password, gender, phonenumber } = data;
    const normalizedEmail = normalizeEmail(email);

    const checkEmailDuplicate = await userRepo.findByEmail(normalizedEmail);
    if (checkEmailDuplicate) {
        throw new AppError("Email already exists", 409);
    }

    const createdUser = await userRepo.createDocument({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hash(password),
        gender,
        phonenumber: phonenumber ? encrypt(phonenumber) : undefined,
    });

    return sanitizeUser(createdUser);
};

export const login = async (data) => {
    const { email, password } = data;
    const user = await userRepo.findByEmail(normalizeEmail(email), { provider: prvidors.System });

    if (!user) {
        throw new AppError("Invalid email or password", 400);
    }

    const isMatch = compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 400);
    }

    if (!jwtsecret.ACCESS_SECRET) {
        throw new AppError("JWT_ACCESS_SECRET is missing from environment variables", 500);
    }

    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtsecret.ACCESS_SECRET,
        { expiresIn: "1d" 
            ,audience:"web , mobile",
            issuer:"sarahah_app",
            jwtid: "262",
            noTimestamp: true
        },
        
    );

    return {
        user: sanitizeUser(user),
        accessToken,
    };
};

const generateToken = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        jwtsecret.ACCESS_SECRET,
        {
            expiresIn: "1d",
            audience: "web,mobile",
            issuer: "sarahah_app",
            jwtid: "262",
            noTimestamp: true
        }
    );

    return accessToken;
};


const verifyGoogleToken = async (idToken) => {
  
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: gcp.webClientid,
        });
        return ticket.getPayload();
  
}




export const gmailRegisterService = async (body) => {
    const { idToken } = body;

    const payload = await verifyGoogleToken(idToken);

    if (!payload || !payload.email_verified) {
        throw new AppError("Invalid Google token", 400);
    }

    const user = await userRepo.findDocument({
        $or: [
            { googlesub: payload.sub },
            { email: payload.email }
        ],
        Provider: prvidors.GOOGLE
    });

    let userData;

    if (user) {
        userData = await userRepo.updateDocumentWithUpdateOne({
            id: user._id,
            data: {
                firstName: payload.given_name,
                lastName: payload.family_name,
                email: payload.email,
            },
            Option: { new: true }
        });
    } else {
        const hashedPassword = await hash(
            crypto.randomBytes(16).toString("hex")
        );

        userData = await userRepo.createDocument({
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email,
            googlesub: payload.sub,
            Provider: prvidors.GOOGLE,
            password: hashedPassword,
        });
    }

    const accessToken = generateToken(userData);

    return {
        user: sanitizeUser(userData),
        accessToken,
    };
};

export const gmailLoginService = async (body) => {
    const { idToken } = body;

    const payload = await verifyGoogleToken(idToken);

    if (!payload || !payload.email_verified) {
        throw new AppError("Invalid Google token", 400);
    }

    const user = await userRepo.findDocument({
        googlesub: payload.sub,
        Provider: prvidors.GOOGLE
    });

    if (!user) {
        throw new AppError("User not found, please register first", 404);
    }

    const accessToken = generateToken(user);

    return {
        user: sanitizeUser(user),
        accessToken,
    };
};
    