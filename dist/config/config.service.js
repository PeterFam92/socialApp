"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHILE_LIST = exports.user_Password = exports.user_Email = exports.GOOGLE_CLIENT_ID = exports.ACCESS_TOKEN_EXPIRATION = exports.REFRESH_TOKEN_EXPIRATION = exports.REFRESH_TOKEN_SECRET_ADMIN = exports.ACCESS_TOKEN_SECRET_ADMIN = exports.REFRESH_TOKEN_SECRET_USER = exports.ACCESS_TOKEN_SECRET_USER = exports.ENC_KEY = exports.SALT_ROUNDS = exports.REDIS_URI = exports.DB_URI = exports.PORT = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), "src/config/.env.dev") });
function getEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}
exports.PORT = getEnv("PORT");
exports.DB_URI = getEnv("DB_URI");
exports.REDIS_URI = getEnv("REDIS_URI");
exports.SALT_ROUNDS = getEnv("SALT_ROUNDS");
exports.ENC_KEY = getEnv("ENCRYPTION_SECRET_KEY");
// TOKENS
exports.ACCESS_TOKEN_SECRET_USER = getEnv("ACCESS_TOKEN_SECRET_USER");
exports.REFRESH_TOKEN_SECRET_USER = getEnv("REFRESH_TOKEN_SECRET_USER");
exports.ACCESS_TOKEN_SECRET_ADMIN = getEnv("ACCESS_TOKEN_SECRET_ADMIN");
exports.REFRESH_TOKEN_SECRET_ADMIN = getEnv("REFRESH_TOKEN_SECRET_ADMIN");
// EXPIRES
exports.REFRESH_TOKEN_EXPIRATION = getEnv("REFRESH_TOKEN_EXPIRATION");
exports.ACCESS_TOKEN_EXPIRATION = getEnv("ACCESS_TOKEN_EXPIRATION");
exports.GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
exports.user_Email = getEnv("user_Email");
exports.user_Password = getEnv("user_Password");
exports.WHILE_LIST = getEnv("WHILE_LIST").split(",");
