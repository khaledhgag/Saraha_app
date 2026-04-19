import crypto from "node:crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export const hash = (plaintext) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto
        .pbkdf2Sync(plaintext, salt, ITERATIONS, KEY_LENGTH, DIGEST)
        .toString("hex");

    return `${salt}:${derivedKey}`;
};

export const compare = (plaintext, hashtext) => {
    const [salt, storedHash] = hashtext.split(":");

    if (!salt || !storedHash) {
        return false;
    }

    const derivedKey = crypto
        .pbkdf2Sync(plaintext, salt, ITERATIONS, KEY_LENGTH, DIGEST)
        .toString("hex");

    return crypto.timingSafeEqual(
        Buffer.from(derivedKey, "hex"),
        Buffer.from(storedHash, "hex")
    );
};
