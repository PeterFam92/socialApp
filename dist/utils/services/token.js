"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_enum_1 = require("../enums/auth.enum");
const uuid_1 = require("uuid");
const config_service_1 = require("../../config/config.service");
const error_response_1 = require("../response/error.response");
const user_repo_1 = require("../../db/repositories/user.repo");
const user_model_1 = require("../../db/models/user.model");
const redis_service_1 = require("../../db/redis.service");
class tokenService {
    _userRepo = new user_repo_1.userRepository(user_model_1.userModel);
    constructor() { }
    sign = async (payload, secret, options) => {
        return jsonwebtoken_1.default.sign(payload, secret, options);
    };
    verify = async (token, secret) => {
        return jsonwebtoken_1.default.verify(token, secret);
    };
    getSignature = ({ signatureLevel = auth_enum_1.signatureEnum.USER }) => {
        const signature = {
            accessSignature: "",
            refreshSignature: ""
        };
        switch (signatureLevel) {
            case auth_enum_1.signatureEnum.ADMIN:
                signature.accessSignature = config_service_1.ACCESS_TOKEN_SECRET_ADMIN;
                signature.refreshSignature = config_service_1.REFRESH_TOKEN_SECRET_ADMIN;
                break;
            case auth_enum_1.signatureEnum.USER:
                signature.accessSignature = config_service_1.ACCESS_TOKEN_SECRET_USER;
                signature.refreshSignature = config_service_1.REFRESH_TOKEN_SECRET_USER;
                break;
            default:
                signature.accessSignature = config_service_1.ACCESS_TOKEN_SECRET_USER;
                signature.refreshSignature = config_service_1.REFRESH_TOKEN_SECRET_USER;
                break;
        }
        return signature;
    };
    getNewCredentials = async (user) => {
        const signature = await this.getSignature({ signatureLevel: user.role != auth_enum_1.RoleEnum.ADMIN ? auth_enum_1.signatureEnum.USER :
                auth_enum_1.signatureEnum.ADMIN
        });
        const jwtid = (0, uuid_1.v4)();
        const accessToken = await this.sign({ id: user._id, jti: jwtid }, signature.accessSignature, { expiresIn: Number(config_service_1.ACCESS_TOKEN_EXPIRATION) });
        const refreshToken = await this.sign({ id: user._id, jti: jwtid }, signature.refreshSignature, { expiresIn: Number(config_service_1.REFRESH_TOKEN_EXPIRATION) });
        return { accessToken, refreshToken };
    };
    decodedToken = async ({ authorization, tokenType = auth_enum_1.tokenTypeEnum.ACCESS }) => {
        if (!authorization)
            throw new error_response_1.BadRequestException("authorization header is missing");
        const [Bearer, token] = authorization.split(" ") || [];
        if (!Bearer || !token)
            throw new error_response_1.BadRequestException("invalid token format");
        let signature = await this.getSignature({ signatureLevel: Bearer === "Admin" ? auth_enum_1.signatureEnum.ADMIN :
                auth_enum_1.signatureEnum.USER
        });
        const secret = tokenType === auth_enum_1.tokenTypeEnum.ACCESS ? signature.accessSignature : signature.refreshSignature;
        const decoded = await this.verify(token, secret);
        const isRevoked = await (0, redis_service_1.get)({
            key: (0, redis_service_1.revokeTokenKey)({ userId: decoded.id, jti: decoded.jti })
        });
        if (isRevoked)
            throw new error_response_1.UnauthorizedRequestException("token is revoked");
        const user = await this._userRepo.findById({ id: decoded.id });
        if (!user)
            throw new error_response_1.NotFoundException("not registered account");
        return { user, decoded };
    };
}
exports.tokenService = tokenService;
