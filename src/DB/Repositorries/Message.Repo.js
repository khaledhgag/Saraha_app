import { BaseRepo } from "./Base.Repo.js";
import messageModel from "../models/messages.model.js";

export class MessageRepo extends BaseRepo {
    constructor() {
        super(messageModel);
    }

    listUserMessages(userId) {
        return this.model
            .find({ receiverId: userId })
            .populate("receiverId", "firstName lastName email")
            .sort({ createdAt: -1 });
    }
}
