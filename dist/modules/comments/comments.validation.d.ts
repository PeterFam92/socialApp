import { z } from "zod";
export declare const createCommentSchema: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const createReplySchema: {
    params: z.ZodObject<{
        postId: z.ZodOptional<z.ZodString>;
        commentId: z.ZodString;
    }, z.core.$strict>;
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
};
