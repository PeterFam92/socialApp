import { NextFunction, Request, Response } from "express";
import { ZodType } from 'zod';
import { z } from "zod";
type keyReqType = keyof Request;
type schemaType = Partial<Record<keyReqType, ZodType>>;
export declare const validation: (schema: schemaType) => (req: Request, res: Response, next: NextFunction) => NextFunction;
export declare const generalFields: {
    username: z.ZodString;
    confirmPassword: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    gender: z.ZodEnum<{
        male: "male";
        female: "female";
    }>;
};
export {};
