"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.validation = void 0;
const error_response_1 = require("../utils/response/error.response");
const zod_1 = require("zod");
const validation = (schema) => {
    return (req, res, next) => {
        const validationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error;
                validationError.push({
                    key,
                    issues: errors.issues.map((issue) => ({
                        message: issue.message,
                        path: issue.path,
                        code: issue.code,
                    })),
                });
            }
        }
        if (validationError.length > 0) {
            throw new error_response_1.BadRequestException('validation error', {
                cause: validationError,
            });
        }
        return next();
    };
};
exports.validation = validation;
exports.generalFields = {
    username: zod_1.z.string({ error: 'username is required' })
        .min(3, { error: 'username must be at least 3 characters long' })
        .max(20, { error: 'username must be at most 20 characters long' }),
    confirmPassword: zod_1.z.string({ error: 'confirm password is required' }),
    email: zod_1.z.email({ error: 'invalid email address' }),
    password: zod_1.z.string({ error: 'password is required' })
        .min(6, { error: 'password must be at least 6 characters long' }),
    gender: zod_1.z.enum(['male', 'female'], { error: 'gender must be either male or female' }),
};
