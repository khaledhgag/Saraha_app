import crypto from 'node:crypto';
import envconfig from '../config/env.config.js';
const encryptionEnv= envconfig.encryption;

const resolveKey = () => {
    const rawKey = encryptionEnv.ENCRYPTION_KEY ?? '';
    const normalizedHex = rawKey.trim();

    if (/^[0-9a-fA-F]{64}$/.test(normalizedHex)) {
        return Buffer.from(normalizedHex, 'hex');
    }

    return crypto.createHash('sha256').update(rawKey).digest();
};

const resolveIvLength = () => {
    const parsedIvLength = Number.parseInt(encryptionEnv.ENCRYPTION_IV, 10);

    return Number.isInteger(parsedIvLength) && parsedIvLength > 0 ? parsedIvLength : 16;
};

//================== symmetric encryption ==================//
export const encrypt =(plaintext)=>{
    const iv = crypto.randomBytes(resolveIvLength());
    const cipher = crypto.createCipheriv('aes-256-cbc', resolveKey(), iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;

}





//================== symmetric encryption ==================//

export const decrypt =(inputcipher)=>{
    const [ivHex, encrypted] = inputcipher.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', resolveKey(), Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
