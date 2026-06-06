import crypto from "node:crypto";
import { ENC_KEY } from "../../config/config.service";
import { buffer } from "node:stream/consumers";

const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY:Buffer=Buffer.from(ENC_KEY,"utf-8")
if(ENCRYPTION_SECRET_KEY.length !==32){
    throw new Error("encryption key must be 32bytes for aes-256-cbc")
}

export const encrypt = async (text:string):Promise<string> => {
  const iv:Buffer = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECRET_KEY,
    iv,
  );
  let encryptedData = cipher.update(text, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
};

export const decrypt = async (encryptedData:string):Promise<string> => {
  const [ivHex, encryptedText] = encryptedData.split(":");
  if (!ivHex || !encryptedText) {
    throw new Error("invalid encrypted format");
  }

  const iv:Buffer = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_SECRET_KEY,
    iv,
  );
  let decryptedData:string = decipher.update(encryptedText, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");
  return decryptedData;
};
