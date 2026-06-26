"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpschema = exports.logOutschema = exports.confirmEmailschema = exports.loginschema = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_enum_1 = require("../../utils/enums/auth.enum");
exports.loginschema = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password,
        FCM: zod_1.z.string().optional()
    })
};
exports.confirmEmailschema = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
        otp: validation_middleware_1.generalFields.otp,
    })
};
exports.logOutschema = {
    body: zod_1.z.strictObject({
        flag: zod_1.z.enum(auth_enum_1.logOutTypeEnum)
    })
};
exports.signUpschema = {
    body: exports.loginschema.body.extend({
        username: validation_middleware_1.generalFields.username,
        confirmPassword: validation_middleware_1.generalFields.confirmPassword,
        phone: zod_1.z.string(),
        gender: validation_middleware_1.generalFields.gender
    })
        .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'passwords do not match',
                path: ['confirmPassword'],
            });
        }
        if (data.username.split(' ').length !== 2) {
            ctx.addIssue({
                code: 'custom',
                message: 'username must contain first and last name',
                path: ['username'],
            });
        }
    }),
};
