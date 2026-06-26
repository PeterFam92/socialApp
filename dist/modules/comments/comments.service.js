"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_service_1 = require("../../utils/services/notification.service");
const user_model_1 = require("../../db/models/user.model");
const post_model_1 = require("../../db/models/post.model");
const user_repo_1 = require("../../db/repositories/user.repo");
const post_repo_1 = require("../../db/repositories/post.repo");
const post_service_1 = require("../post/post.service");
const error_response_1 = require("../../utils/response/error.response");
const redis_service_1 = require("../../db/redis.service");
const comment_repo_1 = require("../../db/repositories/comment.repo");
const comment_model_1 = require("../../db/models/comment.model");
class commentService {
    _userRepo = new user_repo_1.userRepository(user_model_1.userModel);
    _postRepo = new post_repo_1.postRepository(post_model_1.postModel);
    _commentRepo = new comment_repo_1.commentRepository(comment_model_1.commentModel);
    _notificationService;
    constructor() {
        this._notificationService = new notification_service_1.NotificationService();
    }
    createComment = async (req, res) => {
        const { postId } = req.params;
        const { tags = [], content } = req.body;
        const post = await this._postRepo.findOne({ filter: { _id: postId, $or: (0, post_service_1.getAvailability)(req.user) } });
        if (!post)
            throw new error_response_1.NotFoundException("fail to find matching post");
        const mentions = [];
        const FCM_Tokens = [];
        if (tags?.length) {
            const mentionedAccounts = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });
            if (mentionedAccounts.length != tags.length) {
                throw new error_response_1.NotFoundException("fail to find some or all mentioned accounts");
            }
            for (const tag of tags) {
                mentions.push(tag);
                await (await (0, redis_service_1.getFCM)(tag)).map((token) => FCM_Tokens.push(token));
            }
        }
        const [comment] = await this._commentRepo.create({
            data: [{
                    createdBy: req.user._id,
                    content: content,
                    postId: post._id,
                    tags: mentions,
                }]
        }) || [];
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
            });
        }
        return res.status(200).json({ message: "hello from comment services", comment });
    };
    createReply = async (req, res) => {
        const { postId, commentId } = req.params;
        const { tags = [], content } = req.body;
        const filter = { _id: commentId };
        if (postId) {
            filter.postId = postId;
        }
        const comment = await this._commentRepo.findOne({
            filter,
            options: {
                populate: [
                    {
                        path: "postId",
                        match: {
                            $or: (0, post_service_1.getAvailability)(req.user)
                        }
                    }
                ]
            }
        });
        if (!comment || !comment.postId)
            throw new error_response_1.NotFoundException("fail to find matching comment");
        const mentions = [];
        const FCM_Tokens = [];
        if (tags?.length) {
            const mentionedAccounts = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });
            if (mentionedAccounts.length != tags.length) {
                throw new error_response_1.NotFoundException("fail to find some or all mentioned accounts");
            }
            for (const tag of tags) {
                mentions.push(tag);
                await (await (0, redis_service_1.getFCM)(tag)).map((token) => FCM_Tokens.push(token));
            }
        }
        const post = comment.postId;
        const [reply] = await this._commentRepo.create({
            data: [{
                    createdBy: req.user._id,
                    content: content,
                    postId: post._id,
                    commentId: comment._id,
                    tags: mentions,
                }]
        }) || [];
        if (FCM_Tokens.length && reply) {
            this._notificationService.sendNotifications({
                tokens: FCM_Tokens,
                data: {
                    title: "post mention",
                    body: JSON.stringify({
                        message: `${req.user.username} mentioned you in a post`,
                        postId: post._id,
                        commentId: comment._id,
                        replyId: reply._id
                    })
                }
            });
        }
        return res.status(200).json({ message: "hello from comment services", reply });
    };
}
exports.default = new commentService();
