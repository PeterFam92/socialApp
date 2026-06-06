"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_service_1 = require("../../config/config.service");
const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY = Buffer.from(config_service_1.ENC_KEY, "utf-8");
if (ENCRYPTION_SECRET_KEY.length !== 32) {
    throw new Error("encryption key must be 32bytes for aes-256-cbc");
}
const encrypt = async (text) => {
    const iv = node_crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = node_crypto_1.default.createCipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);
    let encryptedData = cipher.update(text, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return `${iv.toString("hex")}:${encryptedData}`;
};
exports.encrypt = encrypt;
const decrypt = async (encryptedData) => {
    const [ivHex, encryptedText] = encryptedData.split(":");
    if (!ivHex || !encryptedText) {
        throw new Error("invalid encrypted format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const decipher = node_crypto_1.default.createDecipheriv("aes-256-cbc", ENCRYPTION_SECRET_KEY, iv);
    let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
};
exports.decrypt = decrypt;
