import { Request, Response } from 'express';
declare class AuthenticationService {
    private _userRepo;
    private _tokenService;
    constructor();
    signup: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Promise<Response>;
    confirmEmail: (req: Request, res: Response) => Promise<Response>;
    logoutWithRedis: (req: Request, res: Response) => Promise<Response>;
    verifyGoogleAccount: ({ idToken }: {
        idToken: string;
    }) => Promise<import("google-auth-library").TokenPayload | undefined>;
    googleLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthenticationService;
export default _default;
