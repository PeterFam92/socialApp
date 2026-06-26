"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: function () { return !this.attatchments?.length; }
    },
    attatchments: [{ type: String }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "post" },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "comment" },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    deletedAt: { type: Date },
    restoredAt: { type: Date },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.commentModel = (0, mongoose_1.model)("comment", commentSchema);
