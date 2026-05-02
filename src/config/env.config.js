import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const nodeEnv = process.env.NODE_ENV ?? "dev";
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");

config({
    path: [
        resolve(projectRoot, `.${nodeEnv}.env`),
        resolve(projectRoot, ".env"),
    ],
});

const envconfig = {
    app:{
        NODE_ENV: nodeEnv,
        PORT: process.env.PORT ?? 8000
    },
    database:{
        MongoURI: process.env.MongoURI ?? 'mongodb://localhost:27017/Sarahah_app'
    },
    encryption:{
        ENCRYPTION_KEY: process.env.ENC_KEY,
        ENCRYPTION_IV: process.env.ENC_IV
    },
    JWT:{
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET
    },
    gcp:{
        webClientid: process.env.GCP_CLIENT_ID
    },
    mail: {
        SERVICE: process.env.MAIL_SERVICE,
        HOST: process.env.MAIL_HOST,
        PORT: process.env.MAIL_PORT,
        USER: process.env.MAIL_USER,
        PASS: process.env.MAIL_PASS,
        FROM: process.env.MAIL_FROM ?? process.env.MAIL_USER,
    }
};


export default envconfig;
