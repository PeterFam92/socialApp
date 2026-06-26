import { Request, Response } from "express";
import { HUserDocument } from "../../db/models/user.model";
import { Types } from "mongoose";
import { AvailabilityEnum } from "../../utils/enums/auth.enum";
export declare const getAvailability: (user: HUserDocument) => ({
    availability: AvailabilityEnum;
    createdBy?: never;
    tags?: never;
} | {
    availability: AvailabilityEnum;
    createdBy: Types.ObjectId;
    tags?: never;
} | {
    tags: {
        $in: Types.ObjectId[];
    };
    availability?: never;
    createdBy?: never;
})[];
declare class postService {
    private readonly _userRepo;
    private readonly _postRepo;
    private readonly _notificatificationService;
    constructor();
    createPost: (req: Request, res: Response) => Promise<Response>;
    reactPost: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: postService;
export default _default;
