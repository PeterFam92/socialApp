import { z } from 'zod';
export declare const loginschema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strict>;
};
export declare const signUpschema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        username: z.ZodString;
        confirmPassword: z.ZodString;
        phone: z.ZodString;
        gender: z.ZodEnum<{
            male: "male";
            female: "female";
        }>;
    }, z.core.$strict>;
};
