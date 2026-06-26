"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const auth_enum_1 = require("../../utils/enums/auth.enum");
const hash_1 = require("../../utils/security/hash");
const encryption_1 = require("../../utils/security/encryption");
const email_events_1 = require("../../utils/events/email.events");
const generateOTP_1 = require("../../utils/security/generateOTP");
exports.userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 25 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 25 },
    email: { type: String, required: true, unique: true },
    password: {
        type: String, required: function () {
            return this.provider === auth_enum_1.ProviderEnum.SYSTEM;
        }
    },
    confirmEmailOtp: { type: String },
    confirmEmail: { type: Date },
    profilePicture: { type: String },
    resetPasswordOtp: { type: String },
    phone: { type: String, required: true },
    address: { type: String },
    gender: { type: String, enum: Object.values(auth_enum_1.GenderEnum), default: auth_enum_1.GenderEnum.MALE },
    role: { type: String, enum: Object.values(auth_enum_1.RoleEnum), default: auth_enum_1.RoleEnum.USER },
    changeCredentialsTime: { type: Date },
    provider: {
        type: String,
        enum: Object.values(auth_enum_1.ProviderEnum),
        default: auth_enum_1.ProviderEnum.SYSTEM
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.userSchema.pre("validate", function () {
    this.email = this.email.toLocaleLowerCase().trim();
});
exports.userSchema.pre("save", async function () {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
        this.password = await (0, hash_1.generateHash)(this.password);
    }
    if (this.isModified("phone")) {
        this.phone = await (0, encryption_1.encrypt)(this.phone);
    }
});
exports.userSchema.post("save", async function () {
    const that = this;
    if (that.wasNew) {
        await email_events_1.emailEvents.emit("confirmEmail", { otp: (0, generateOTP_1.generateOtp)(), to: this.email, username: this.username });
    }
});
exports.userSchema.post("insertMany", async function (docs, next) {
    next();
});
exports.userModel = mongoose_2.default.model("User", exports.userSchema);
