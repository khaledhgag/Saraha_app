import { Router } from "express";
import * as userService from "./user.services.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { isAuthenticated, validate } from "../../Middlewares/index.js";
import {
    createUserSchema,
    getUserMessagesSchema,
    updateUserSchema,
    userIdSchema,
} from "../../validators/index.js";

const usercontroller = Router();

usercontroller.post("/", validate(createUserSchema), asyncHandler(async (req, res) => {
        const data = await userService.createUserService(req.body);
        res.status(201).json({ message: "User created successfully", data });
}));

usercontroller.get("/", asyncHandler(async (req, res) => {
        const data = await userService.getUsersService(req.query);
        res.status(200).json({ message: "Users fetched successfully", data });
}));

usercontroller.get("/:id/messages", isAuthenticated, validate(getUserMessagesSchema), asyncHandler(async (req, res) => {
        const data = await userService.getUserMessagesService(req.params.id, req.query, req.user);
        res.status(200).json({ message: "User messages fetched successfully", data });
}));

usercontroller.get("/:id", isAuthenticated, validate(userIdSchema), asyncHandler(async (req, res) => {
        const data = await userService.getUserByIdService(req.params.id, req.user);
        res.status(200).json({ message: "User fetched successfully", data });
}));

usercontroller.put("/:id", isAuthenticated, validate(updateUserSchema), asyncHandler(async (req, res) => {
        const data = await userService.updateUserService(req.params.id, req.body, req.user);
        res.status(200).json({ message: "User updated successfully", data });
}));

usercontroller.patch("/:id", isAuthenticated, validate(updateUserSchema), asyncHandler(async (req, res) => {
        const data = await userService.updateUserService(req.params.id, req.body, req.user);
        res.status(200).json({ message: "User updated successfully", data });
}));

usercontroller.delete("/:id", isAuthenticated, validate(userIdSchema), asyncHandler(async (req, res) => {
        const data = await userService.deleteUserService(req.params.id, req.user);
        res.status(200).json(data);
}));

export default usercontroller;
