"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpschema = exports.loginschema = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
exports.loginschema = {
    body: zod_1.z.strictObject({
        email: validation_middleware_1.generalFields.email,
        password: validation_middleware_1.generalFields.password,
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
