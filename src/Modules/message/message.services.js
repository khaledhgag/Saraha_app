import { messageRepo, userRepo } from "../../DB/Repositorries/Index.js";
import { AppError } from "../../common/error/app.error.js";

const defaultPopulation = {
    path: "receiverId",
    select: "firstName lastName email",
};

const ensureReceiverExists = async (receiverId) => {
    const user = await userRepo.findPublicProfileById(receiverId);

    if (!user) {
        throw new AppError("Receiver user not found", 404);
    }

    return user;
};

export const createMessageService = async (data) => {
    await ensureReceiverExists(data.receiverId);

    const message = await messageRepo.createDocument({
        content: data.content,
        receiverId: data.receiverId,
    });

    return message.populate(defaultPopulation);
};

export const getMessagesService = async (receiverId, query = {}) => {
    const filter = receiverId ? { receiverId } : {};
    return messageRepo
        .findDocument(filter, null, {
            sort: { createdAt: -1 },
            limit: query.limit ? Number(query.limit) : undefined,
            skip: query.skip ? Number(query.skip) : undefined,
        })
        .populate(defaultPopulation);
};

export const getMessageByIdService = async (id) => {
    const message = await messageRepo.findDocumentById(id).populate(defaultPopulation);

    if (!message) {
        throw new AppError("Message not found", 404);
    }

    return message;
};

export const updateMessageService = async (id, data) => {
    if (data.receiverId) {
        await ensureReceiverExists(data.receiverId);
    }

    const updatedMessage = await messageRepo
        .findByIdAndUpdateDocument(id, data)
        .populate(defaultPopulation);

    if (!updatedMessage) {
        throw new AppError("Message not found", 404);
    }

    return updatedMessage;
};

export const deleteMessageService = async (id) => {
    const deletedMessage = await messageRepo.findByIdAndDeleteDocument(id);

    if (!deletedMessage) {
        throw new AppError("Message not found", 404);
    }

    return { message: "Message deleted successfully" };
};
