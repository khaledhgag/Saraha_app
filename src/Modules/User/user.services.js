import { messageRepo, userRepo } from "../../DB/Repositorries/Index.js";
import { AppError } from "../../common/error/app.error.js";
import { hash } from "../../common/security/hash.js";
import { decrypt, encrypt } from "../../Utils/encryption.utils.js";
const normalizeEmail = (email = "") => email.trim().toLowerCase();

const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const plainUser = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = plainUser;

    if (safeUser.phonenumber) {
        safeUser.phonenumber = decrypt(safeUser.phonenumber);
    }

    return safeUser;
};

const buildUserPayload = (data, { allowPassword = true } = {}) => {
    const payload = { ...data };

    if (payload.email) {
        payload.email = normalizeEmail(payload.email);
    }

    if (allowPassword && payload.password) {
        payload.password = hash(payload.password);
    } else {
        delete payload.password;
    }

    if (payload.phonenumber) {
        payload.phonenumber = encrypt(payload.phonenumber);
    }

    return payload;
};

const ensureUserExists = async (id) => {
    const user = await userRepo.findPublicProfileById(id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

const ensureEmailIsUnique = async (email, userId = null) => {
    if (!email) {
        return;
    }

    const existingUser = await userRepo.findByEmail(normalizeEmail(email));

    if (existingUser && existingUser._id.toString() !== userId) {
        throw new AppError("Email already exists", 409);
    }
};

const ensureSameUser = (id, authUser) => {
    if (id !== authUser.userId) {
        throw new AppError("You can only access your own account", 403);
    }
};

export const createUserService = async (data) => {
    await ensureEmailIsUnique(data.email);

    const createdUser = await userRepo.createDocument(buildUserPayload(data));

    return sanitizeUser(createdUser);
};

export const getUsersService = async (query = {}) => {
    const users = await userRepo.findDocument({}, null, {
        sort: { createdAt: -1 },
        limit: query.limit ? Number(query.limit) : undefined,
        skip: query.skip ? Number(query.skip) : undefined,
    });

    return users.map(sanitizeUser);
};

export const getUserByIdService = async (id, authUser) => {
    ensureSameUser(id, authUser);

    const user = await ensureUserExists(authUser.userId);

    return sanitizeUser(user);
};

export const updateUserService = async (id, data, authUser) => {
    ensureSameUser(id, authUser);
    await ensureEmailIsUnique(data.email, id);

    const updatedUser = await userRepo.updateProfile(
        id,
        buildUserPayload(data)
    );

    if (!updatedUser) {
        throw new AppError("User not found", 404);
    }

    return sanitizeUser(updatedUser);
};

export const deleteUserService = async (id, authUser) => {
    ensureSameUser(id, authUser);
    const deletedUser = await userRepo.deleteAccount(id);

    if (!deletedUser) {
        throw new AppError("User not found", 404);
    }

    await messageRepo.deleteManyDocuments({
        receiverId: id,
    });

    return { message: "User deleted successfully" };
};

export const getUserMessagesService = async (userId, query = {}, authUser) => {
    ensureSameUser(userId, authUser);
    await ensureUserExists(userId);

    const messages = await messageRepo.listUserMessages(userId);

    if (query.skip) {
        messages.splice(0, Number(query.skip));
    }

    if (query.limit) {
        return messages.slice(0, Number(query.limit));
    }

    return messages;
};
