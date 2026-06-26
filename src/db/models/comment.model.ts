import { model, Schema, Types } from "mongoose"
import { IUser } from "./user.model"
import { AvailabilityEnum } from "../../utils/enums/auth.enum"
import { userModel } from "./user.model";
import { IPost } from "./post.model";



export interface IComment {

    content?: string;
    attatchments?: string[];

    likes?: Types.ObjectId[] | IUser;
    tags?: Types.ObjectId[] | IUser;
    commentId: Types.ObjectId;
    postId:Types.ObjectId | IPost

    createdBy: Types.ObjectId | IUser;
    updatedBy?: Types.ObjectId | IUser;

    createdAt: Date;
    updatedAt?: Date;

    deletedAt?: Date;
    restoredAt?: Date;
}


const commentSchema = new Schema<IComment>(
    {
        
        content: {
            type: String,
            required: function (this: any) { return !this.attatchments?.length }
        },
        attatchments: [{ type: String }],
       
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
        postId:{type:Schema.Types.ObjectId, ref:"post"},

        commentId:{ type: Schema.Types.ObjectId, ref: "comment" },
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



export const commentModel = model<IComment>("comment", commentSchema)