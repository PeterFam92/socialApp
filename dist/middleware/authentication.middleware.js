"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = exports.authentication = void 0;
const auth_enum_1 = require("../utils/enums/auth.enum");
const token_1 = require("../utils/services/token");
const error_response_1 = require("../utils/response/error.response");
const authentication = ({ tokenType = auth_enum_1.tokenTypeEnum.ACCESS }) => {
    return async (req, res, next) => {
        const tokenservice = new token_1.tokenService();
        if (!req.headers.authorization)
            throw new error_response_1.BadRequestException("authorization header is missing");
        const { user, decoded } = await tokenservice.decodedToken({
            authorization: req.headers.authorization,
            tokenType,
        }) || {};
        req.user = user;
        req.decoded = decoded;
        return next();
    };
};
exports.authentication = authentication;
const authorization = ({ accessRole = [] }) => {
    return async (req, res, next) => {
        if (!req.user.role || !accessRole.includes(req.user.role))
            throw new error_response_1.ForbiddenRequestException("forbidden request");
        return next();
    };
};
exports.authorization = authorization;
