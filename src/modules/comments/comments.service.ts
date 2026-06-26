
import { Response, Request, NextFunction } from "express"
import { NotificationService } from "../../utils/services/notification.service"
import { userModel } from "../../db/models/user.model"
import { IPost, postModel } from "../../db/models/post.model"
import { userRepository } from "../../db/repositories/user.repo"
import { postRepository } from "../../db/repositories/post.repo"
import { getAvailability } from "../post/post.service"
import { NotFoundException } from "../../utils/response/error.response"
import { HydratedDocument, Types } from "mongoose"
import { getFCM } from "../../db/redis.service"
import { get } from "node:http"
import { commentRepository } from "../../db/repositories/comment.repo"
import { commentModel } from "../../db/models/comment.model"

class commentService {


    private readonly _userRepo = new userRepository(userModel)
    private readonly _postRepo = new postRepository(postModel)
    private readonly _commentRepo = new commentRepository(commentModel)
    private readonly _notificationService: NotificationService
    constructor() {
        this._notificationService = new NotificationService()
    }

    createComment = async (req: Request, res: Response) => {
        const { postId } = req.params
        const { tags = [], content } = req.body
        const post = await this._postRepo.findOne(
            { filter: { _id: postId, $or: getAvailability(req.user) } })

        if (!post) throw new NotFoundException("fail to find matching post")
        const mentions: Types.ObjectId[] = [];
        const FCM_Tokens: string[] = [];
        if (tags?.length) {
            const mentionedAccounts = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            })

            if (mentionedAccounts.length != tags.length) {
                throw new NotFoundException("fail to find some or all mentioned accounts")
            }

            for (const tag of tags) {
                mentions.push(tag)
                await (await getFCM(tag)).map((token: string) => FCM_Tokens.push(token))
            }


        }
        const [comment] = await this._commentRepo.create({
            data: [{
                createdBy: req.user._id,
                content: content as string,
                postId: post._id,
                tags: mentions,
            }]
        }) || []

        if (FCM_Tokens.length && comment) {
            this._notificationService.sendNotifications({
                tokens: FCM_Tokens,
                data: {
                    title: "post mention",
                    body: JSON.stringify({
                        message: `${req.user.username} mentioned you in a post`,
                        commentId: comment._id
                    })
                }
            })
        }

        return res.status(200).json({ message: "hello from comment services", comment })
    }



    createReply = async (req: Request, res: Response) => {
        const { postId, commentId } = req.params
        const { tags = [], content } = req.body
        const filter: any = { _id: commentId as string };
        if (postId) {
            filter.postId = postId as string;
        }
        const comment = await this._commentRepo.findOne(
            {
                filter,

                options: {
                    populate: [
                        {
                            path: "postId",
                            match: {
                                $or: getAvailability(req.user)
                            }
                        }
                    ]
                }
            })

        if (!comment || !comment.postId) throw new NotFoundException("fail to find matching comment")
        const mentions: Types.ObjectId[] = [];
        const FCM_Tokens: string[] = [];
        if (tags?.length) {
            const mentionedAccounts = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            })

            if (mentionedAccounts.length != tags.length) {
                throw new NotFoundException("fail to find some or all mentioned accounts")
            }

            for (const tag of tags) {
                mentions.push(tag)
                await (await getFCM(tag)).map((token: string) => FCM_Tokens.push(token))
            }


        }

const post=comment.postId as HydratedDocument<IPost>



        const [reply] = await this._commentRepo.create({
            data: [{
                createdBy: req.user._id,
                content: content as string,
                postId:post._id,
                commentId: comment._id,
                tags: mentions,
            }]
        }) || []

        if (FCM_Tokens.length && reply) {
            this._notificationService.sendNotifications({
                tokens: FCM_Tokens,
                data: {
                    title: "post mention",
                    body: JSON.stringify({
                        message: `${req.user.username} mentioned you in a post`,
                        postId:post._id,
                        commentId: comment._id,
                        replyId:reply._id
                    })
                }
            })
        }

        return res.status(200).json({ message: "hello from comment services", reply })
    }

}
export default new commentService();