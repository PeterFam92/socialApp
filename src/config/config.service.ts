import path from "path";
import dotenv from "dotenv";    
dotenv.config({path: path.join(process.cwd(), "src/config/.env.dev")});



function getEnv(key:string): string {
    const value = process.env[key]; 
if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);

}
return value;
}


export const PORT = getEnv("PORT");
export const DB_URI = getEnv("DB_URI");
export const REDIS_URI = getEnv("REDIS_URI");
export const SALT_ROUNDS = getEnv("SALT_ROUNDS");
export const ENC_KEY = getEnv("ENCRYPTION_SECRET_KEY");
// TOKENS
export const ACCESS_TOKEN_SECRET_USER = getEnv("ACCESS_TOKEN_SECRET_USER");
export const REFRESH_TOKEN_SECRET_USER = getEnv("REFRESH_TOKEN_SECRET_USER");
export const ACCESS_TOKEN_SECRET_ADMIN = getEnv("ACCESS_TOKEN_SECRET_ADMIN");
export const REFRESH_TOKEN_SECRET_ADMIN = getEnv("REFRESH_TOKEN_SECRET_ADMIN");


// EXPIRES
export const REFRESH_TOKEN_EXPIRATION = getEnv("REFRESH_TOKEN_EXPIRATION");
export const ACCESS_TOKEN_EXPIRATION = getEnv("ACCESS_TOKEN_EXPIRATION");

export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");

export const user_Email = getEnv("user_Email");
export const user_Password = getEnv("user_Password");

export const WHILE_LIST = getEnv("WHILE_LIST").split(",");