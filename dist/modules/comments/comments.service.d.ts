import { Response, Request } from "express";
declare class commentService {
    private readonly _userRepo;
    private readonly _postRepo;
    private readonly _commentRepo;
    private readonly _notificationService;
    constructor();
    createComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createReply: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
declare const _default: commentService;
export default _default;
