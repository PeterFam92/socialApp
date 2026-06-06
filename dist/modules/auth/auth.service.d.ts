import { Request, Response } from 'express';
declare class AuthenticationService {
    private _userModel;
    constructor();
    signup: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: AuthenticationService;
export default _default;
