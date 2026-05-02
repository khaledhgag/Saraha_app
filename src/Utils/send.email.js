import nodemailer from "nodemailer";
import envconfig from "../config/env.config.js";

const mailConfig = envconfig.mail;

const createTransporter = () => {
    if (mailConfig.SERVICE) {
        return nodemailer.createTransport({
            service: mailConfig.SERVICE,
            auth: {
                user: mailConfig.USER,
                pass: mailConfig.PASS,
            },
        });
    }

    if (mailConfig.HOST && mailConfig.PORT) {
        return nodemailer.createTransport({
            host: mailConfig.HOST,
            port: Number(mailConfig.PORT),
            secure: Number(mailConfig.PORT) === 465,
            auth: {
                user: mailConfig.USER,
                pass: mailConfig.PASS,
            },
        });
    }

    return null;
};

export const sendRevokeTokenEmail = async ({ email, userName }) => {
    if (!email) {
        return false;
    }

    const transporter = createTransporter();
    if (!transporter || !mailConfig.FROM) {
        return false;
    }

    await transporter.sendMail({
        from: mailConfig.FROM,
        to: email,
        subject: "Saraha App Token Revoked",
        html: `
            <h2>Hello ${userName || "User"}</h2>
            <p>Your login token was revoked successfully.</p>
            <p>If this was not you, please log in again.</p>
        `,
    });

    return true;
};
