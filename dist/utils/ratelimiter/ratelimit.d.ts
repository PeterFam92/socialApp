import { NextFunction, Request, Response } from "express";
export declare const customRateLimiter: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
