"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const auth_enum_1 = require("../utils/enums/auth.enum");
exports.userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 25 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 25 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmEmailOtp: { type: String },
    confirmEmail: { type: Date },
    resetPasswordOtp: { type: String },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: Object.values(auth_enum_1.GenderEnum), default: auth_enum_1.GenderEnum.MALE },
    role: { type: String, enum: Object.values(auth_enum_1.RoleEnum), default: auth_enum_1.RoleEnum.USER },
}, { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } });
exports.userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.userModel = mongoose_2.default.model("User", exports.userSchema);
