import { model, Schema, Types } from "mongoose"
import { IUser } from "./user.model"
import { AvailabilityEnum } from "../../utils/enums/auth.enum"
import { userModel } from "./user.model";



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


const postSchema = new Schema<IPost>(
    {
        folderId: { type: String },
        content: {
            type: String,
            required: function (this: any) { return !this.attatchments?.length }
        },
        attatchments: [{ type: String }],
        availability: {
            type: String,
            enum: AvailabilityEnum,
            default: AvailabilityEnum.PUBLIC
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User", required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        deletedAt: { type: Date },
        restoredAt: { type: Date },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)



export const postModel = model<IPost>("Post", postSchema)