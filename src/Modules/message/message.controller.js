import { Router } from "express";
import * as messageService from "./message.services.js";
import { asyncHandler } from "../../common/utils/async-handler.js";

const messagecontroller = Router();

messagecontroller.post("/", asyncHandler(async (req, res) => {
        const data = await messageService.createMessageService(req.body);
        res.status(201).json({ message: "Message created successfully", data });
}));

messagecontroller.get("/", asyncHandler(async (req, res) => {
        const data = await messageService.getMessagesService(req.query.receiverId, req.query);
        res.status(200).json({ message: "Messages fetched successfully", data });
}));

messagecontroller.get("/:id", asyncHandler(async (req, res) => {
        const data = await messageService.getMessageByIdService(req.params.id);
        res.status(200).json({ message: "Message fetched successfully", data });
}));

messagecontroller.put("/:id", asyncHandler(async (req, res) => {
        const data = await messageService.updateMessageService(req.params.id, req.body);
        res.status(200).json({ message: "Message updated successfully", data });
}));

messagecontroller.patch("/:id", asyncHandler(async (req, res) => {
        const data = await messageService.updateMessageService(req.params.id, req.body);
        res.status(200).json({ message: "Message updated successfully", data });
}));

messagecontroller.delete("/:id", asyncHandler(async (req, res) => {
        const data = await messageService.deleteMessageService(req.params.id);
        res.status(200).json(data);
}));

export default messagecontroller;
