"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplySchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
exports.createCommentSchema = {
    params: zod_1.z.strictObject({
        postId: validation_middleware_1.generalFields.id,
    }),
    body: zod_1.z.strictObject({
        content: zod_1.z.string().optional(),
        tags: zod_1.z.array(validation_middleware_1.generalFields.id).optional(),
    }).superRefine((args, ctx) => {
        if (args.tags?.length) {
            const uniqueTags = [...new Set(args.tags)];
            if (uniqueTags.length != args.tags.length) {
                ctx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: "duplicate tags",
                });
            }
        }
    }),
};
exports.createReplySchema = {
    params: zod_1.z.strictObject({
        postId: validation_middleware_1.generalFields.id.optional(),
        commentId: validation_middleware_1.generalFields.id,
    }),
    body: exports.createCommentSchema.body
};
