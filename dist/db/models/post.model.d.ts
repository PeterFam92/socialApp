import { Types } from "mongoose";
import { IUser } from "./user.model";
import { AvailabilityEnum } from "../../utils/enums/auth.enum";
export interface IPost {
    folderId?: string;
    content?: string;
    attatchments?: string[];
    likes?: Types.ObjectId[] | IUser;
    tags?: Types.ObjectId[] | IUser;
    availability: AvailabilityEnum;
    createdBy: Types.ObjectId | IUser;
    updatedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    restoredAt?: Date;
}
export declare const postModel: import("mongoose").Model<IPost, {}, {}, {}, import("mongoose").Document<unknown, {}, IPost, {}, import("mongoose").DefaultSchemaOptions> & IPost & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IPost>;
