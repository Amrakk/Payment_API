import crypto from "crypto";
import { SECRET_KEY, SECRET_IV, ENCRYPTION_METHOD } from "../constants.js";

import UnsupportedError from "../errors/unsupportedError.js";

const supportedServices = ["momo", "payos", "vnpay"];
export function generateSignature(secretKey: string, rawSignature: string, service: string): string {
    if (!supportedServices.includes(service)) throw new UnsupportedError(service, "generateSignature");

    return crypto
        .createHmac(service === "vnpay" ? "sha512" : "sha256", secretKey)
        .update(rawSignature)
        .digest("hex");
}

const key = crypto.createHash("sha512").update(SECRET_KEY).digest("hex").substring(0, 32);
const encryptionIV = crypto.createHash("sha512").update(SECRET_IV).digest("hex").substring(0, 16);

export function encryptData(data: string): string {
    const cipher = crypto.createCipheriv(ENCRYPTION_METHOD, key, encryptionIV);
    return Buffer.from(cipher.update(data, "utf8", "hex") + cipher.final("hex")).toString("base64");
}

export function decryptData(encryptedData: string): string {
    const buff = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv(ENCRYPTION_METHOD, key, encryptionIV);
    return decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
}
