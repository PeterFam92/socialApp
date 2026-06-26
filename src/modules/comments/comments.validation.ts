

import { z } from "zod"
import { generalFields } from "../../middleware/validation.middleware"

export const createCommentSchema = {
    params: z.strictObject({
        postId: generalFields.id,
    }),
    body: z.strictObject({
        content: z.string().optional(),
        tags: z.array(generalFields.id).optional(),
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
}


export const createReplySchema = {
    params: z.strictObject({
        postId: generalFields.id.optional(),
        commentId: generalFields.id,
    }),
    body: createCommentSchema.body

}