import { JwtPayload } from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { RoleEnum, signatureEnum, tokenTypeEnum } from "../enums/auth.enum";
import { HUserDocument } from "../../db/models/user.model";
export interface customJwtPayload extends JwtPayload {
    id: string;
    jti: string;
}
export declare class tokenService {
    private readonly _userRepo;
    constructor();
    sign: (payload: object, secret: string, options?: SignOptions) => Promise<string>;
    verify: (token: string, secret: string) => Promise<customJwtPayload>;
    getSignature: ({ signatureLevel }: {
        signatureLevel?: signatureEnum | undefined;
    }) => {
        accessSignature: string;
        refreshSignature: string;
    };
    getNewCredentials: (user: {
        _id: string;
        role: RoleEnum;
    }) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    decodedToken: ({ authorization, tokenType }: {
        authorization: string;
        tokenType?: tokenTypeEnum;
    }) => Promise<{
        user: HUserDocument;
        decoded: customJwtPayload;
    }>;
}
