import { z } from 'zod';
import { logOutTypeEnum } from '../../utils/enums/auth.enum';
export declare const loginschema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        FCM: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
};
export declare const confirmEmailschema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
    }, z.core.$strict>;
};
export declare const logOutschema: {
    body: z.ZodObject<{
        flag: z.ZodEnum<typeof logOutTypeEnum>;
    }, z.core.$strict>;
};
export declare const signUpschema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        FCM: z.ZodOptional<z.ZodString>;
        username: z.ZodString;
        confirmPassword: z.ZodString;
        phone: z.ZodString;
        gender: z.ZodEnum<{
            male: "male";
            female: "female";
        }>;
    }, z.core.$strict>;
};
