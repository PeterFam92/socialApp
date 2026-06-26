import z from "zod";
export declare const createPostSchema: {
    body: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            fieldname: z.ZodString;
            originalname: z.ZodString;
            encoding: z.ZodString;
            mimeType: z.ZodEnum<{
                [x: string]: string;
            }>;
            buffer: z.ZodOptional<z.ZodAny>;
            path: z.ZodOptional<z.ZodString>;
            size: z.ZodNumber;
        }, z.core.$strict>>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        availability: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>;
};
export declare const reactPostSchema: {
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strict>;
    query: z.ZodObject<{
        react: z.ZodCoercedNumber<unknown>;
    }, z.core.$strict>;
};
