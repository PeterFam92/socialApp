import { Types } from "mongoose";
import { IUser } from "./user.model";
import { IPost } from "./post.model";
export interface IComment {
    content?: string;
    attatchments?: string[];
    likes?: Types.ObjectId[] | IUser;
    tags?: Types.ObjectId[] | IUser;
    commentId: Types.ObjectId;
    postId: Types.ObjectId | IPost;
    createdBy: Types.ObjectId | IUser;
    updatedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    restoredAt?: Date;
}
export declare const commentModel: import("mongoose").Model<IComment, {}, {}, {}, import("mongoose").Document<unknown, {}, IComment, {}, import("mongoose").DefaultSchemaOptions> & IComment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IComment>;
