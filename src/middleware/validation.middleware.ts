
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from 'zod';
import { BadRequestException } from "../utils/response/error.response";
import { z } from "zod";

type keyReqType = keyof Request;
type schemaType = Partial<Record<keyReqType, ZodType>>;

export const validation = (schema: schemaType) => {
    return (req: Request, res: Response, next: NextFunction):NextFunction => {
        const validationError: Array<{
            key: keyReqType;
            issues: Array<{ message: string;
                 path: (string | number | symbol)[]; 
                 code?: string }>;
        }> = [];

        for (const key of Object.keys(schema) as keyReqType[]) {
            if (!schema[key]) continue;

            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error as ZodError;
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
            throw new BadRequestException('validation error', {
                 cause: validationError,

                 });
        }

       return next()as unknown as NextFunction;
    };
};


export const generalFields={
    
        username: z.string({ error: 'username is required' })
          .min(3, { error: 'username must be at least 3 characters long' })
          .max(20, { error: 'username must be at most 20 characters long' }),
        confirmPassword: z.string({ error: 'confirm password is required' }),
        email: z.email({ error: 'invalid email address' }),
        password: z.string({ error: 'password is required' })
          .min(6, { error: 'password must be at least 6 characters long' }),
     gender: z.enum(['male', 'female'], { error: 'gender must be either male or female' }) ,

}





