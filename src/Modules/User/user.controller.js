import { Router } from "express";
import * as userService from "./user.services.js";
import { asyncHandler } from "../../common/utils/async-handler.js";

const usercontroller = Router();

usercontroller.post("/", asyncHandler(async (req, res) => {
        const data = await userService.createUserService(req.body);
        res.status(201).json({ message: "User created successfully", data });
}));

usercontroller.get("/", asyncHandler(async (req, res) => {
        const data = await userService.getUsersService(req.query);
        res.status(200).json({ message: "Users fetched successfully", data });
}));

usercontroller.get("/:id/messages", asyncHandler(async (req, res) => {
        const data = await userService.getUserMessagesService(req.params.id, req.query);
        res.status(200).json({ message: "User messages fetched successfully", data });
}));

usercontroller.get("/:id", asyncHandler(async (req, res) => {
        const data = await userService.getUserByIdService(req.headers);
        res.status(200).json({ message: "User fetched successfully", data });
}));

usercontroller.put("/:id", asyncHandler(async (req, res) => {
        const data = await userService.updateUserService(req.params.id, req.body);
        res.status(200).json({ message: "User updated successfully", data });
}));

usercontroller.patch("/:id", asyncHandler(async (req, res) => {
        const data = await userService.updateUserService(req.params.id, req.body);
        res.status(200).json({ message: "User updated successfully", data });
}));

usercontroller.delete("/:id", asyncHandler(async (req, res) => {
        const data = await userService.deleteUserService(req.params.id);
        res.status(200).json(data);
}));

export default usercontroller;
