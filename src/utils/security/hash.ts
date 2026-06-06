import { hash, compare } from "bcrypt";
import { SALT_ROUNDS } from "../../config/config.service";
import { promises } from "node:dns";

export const generateHash = async (plaintext: string, rounds: number = Number(SALT_ROUNDS)):Promise<string> => {
	return await hash(plaintext, rounds);
};

export const compareHash = async (plaintext: string, hashed: string):Promise<boolean> => {
	return await compare(plaintext, hashed);
};