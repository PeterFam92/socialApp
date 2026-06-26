import { NextFunction, Request, Response } from "express";
import { RoleEnum, tokenTypeEnum } from "../utils/enums/auth.enum";
export declare const authentication: ({ tokenType }: {
    tokenType?: tokenTypeEnum | undefined;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorization: ({ accessRole }: {
    accessRole?: RoleEnum[];
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
