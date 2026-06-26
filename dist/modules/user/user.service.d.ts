import { Response, Request } from "express";
declare class userService {
    constructor();
    getProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: userService;
export default _default;
