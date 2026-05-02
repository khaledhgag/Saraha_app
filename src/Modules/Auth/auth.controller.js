import { Router } from "express";
import * as authService from "./auth.services.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { isAuthenticated, validate } from "../../Middlewares/index.js";
import {
    gmailSchema,
    loginSchema,
    registerSchema,
    revokeTokenSchema,
} from "../../validators/index.js";

const authcontroller = Router();

const signUp = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({message:"User registered successfully", data: result});
});

const signIn = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json({ message: "Login successful", data: result });
});
//gmail register
authcontroller.post("/gmail/register", validate(gmailSchema), asyncHandler(async (req, res) => {
    const result = await authService.gmailRegisterService(req.body);
    res.status(201).json({ message: "User registered with Google successfully", data: result });
}));
//gmail login
authcontroller.post("/gmail/login", validate(gmailSchema), asyncHandler(async (req, res) => {
    const result = await authService.gmailLoginService(req.body);
    res.status(200).json({ message: "Login with Google successful", data: result });
}));
authcontroller.post("/signup", validate(registerSchema), signUp);
authcontroller.post("/register", validate(registerSchema), signUp);
authcontroller.post("/signin", validate(loginSchema), signIn);
authcontroller.post("/login", validate(loginSchema), signIn);
authcontroller.post("/logout", isAuthenticated, asyncHandler(async (req, res) => {
    const result = await authService.logoutService(req.user, req.token);
    res.status(200).json({ message: "Logout successful", data: result });
}));
authcontroller.post("/revoke-token", validate(revokeTokenSchema), asyncHandler(async (req, res) => {
    const result = await authService.revokeTokenByValueService(req.body);
    res.status(200).json({ message: "Token revoked successfully", data: result });
}));

export default authcontroller;
