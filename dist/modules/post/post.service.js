"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailability = void 0;
const user_repo_1 = require("../../db/repositories/user.repo");
const user_model_1 = require("../../db/models/user.model");
const post_repo_1 = require("../../db/repositories/post.repo");
const post_model_1 = require("../../db/models/post.model");
const notification_service_1 = require("../../utils/services/notification.service");
const error_response_1 = require("../../utils/response/error.response");
const redis_service_1 = require("../../db/redis.service");
const auth_enum_1 = require("../../utils/enums/auth.enum");
const getAvailability = (user) => {
    return [
        { availability: auth_enum_1.AvailabilityEnum.PUBLIC },
        { availability: auth_enum_1.AvailabilityEnum.PRIVATE, createdBy: user._id },
        { tags: { $in: [user._id] } }
    ];
};
exports.getAvailability = getAvailability;
class postService {
    _userRepo = new user_repo_1.userRepository(user_model_1.userModel);
    _postRepo = new post_repo_1.postRepository(post_model_1.postModel);
    _notificatificationService;
    constructor() {
        this._notificatificationService = new notification_service_1.NotificationService();
    }
    createPost = async (req, res) => {
        const { content, availability, tags = [] } = req.body;
        const taggedUser = tags.length ? await this._userRepo.find({ filter: { _id: { $in: tags } }, select: "firstName lastName email"
        }) : [];
        if (taggedUser.length != tags.length) {
            throw new error_response_1.NotFoundException("failed to find some or all tagged accounts");
        }
        const tagged = taggedUser.map((user) => user._id);
        const tokensResults = await Promise.all(tags.map((tag) => (0, redis_service_1.getFCM)(tag)));
        const FCM_Tokens = [...new Set(tokensResults.flat().filter((token) => Boolean(token)))];
        const posts = (await this._postRepo.create({
            data: [{
                    content,
                    availability,
                    tags: tagged,
                    createdBy: req.user._id
                },
            ],
        })) || [];
        if (FCM_Tokens.length) {
            this._notificatificationService.sendNotifications({
                tokens: FCM_Tokens,
                data: {
                    title: "post mention",
                    body: JSON.stringify({
                        message: `${req.user.username}mentioned you in a post `,
                        post: posts?.[0]?._id
                    })
                }
            });
        }
        const populatedPosts = await posts?.[0]?.populate([
            { path: "createdBy", select: "firstName  lastName  email" },
            { path: "tags", select: "firstName  lastName   email" }
        ]);
        return res.status(201).json({ message: "done", populatedPosts });
    };
    reactPost = async (req, res) => {
        const { postId } = req.params;
        const { react } = req.query;
        const post = await this._postRepo.findOneAndUpdate({
            filter: {
                _id: postId,
                $or: (0, exports.getAvailability)(req.user)
            },
            update: Number(react) > 0
                ? { $addToSet: { likes: req.user._id } }
                : { $pull: { likes: req.user._id } },
        });
        if (!post) {
            throw new error_response_1.NotFoundException("fail to find matching post");
        }
        return res.status(200).json({ message: 'reactPost success', post });
    };
}
exports.default = new postService;
