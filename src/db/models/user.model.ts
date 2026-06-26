import { HydratedDocument, Schema } from "mongoose";
import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../utils/enums/auth.enum";
import { string } from "zod";
import { generateHash } from "../../utils/security/hash";
import { encrypt } from "../../utils/security/encryption";
import { emailEvents } from "../../utils/events/email.events";
import { generateOtp } from "../../utils/security/generateOTP";


export interface IUser {
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    confirmEmailOtp?: string;
    confirmEmail?: Date;
    password: string;
    resetPasswordOtp?: string;
    phone: string;
    address?: string;
    provider?: ProviderEnum;
    gender: GenderEnum;
    role?: RoleEnum;
    createdAt: Date;
    updatedAt?: Date;
    confirmedAt: Date;
    changeCredentialsTime: Date;
    profilePicture?: string

}

export const userSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 25 },
        lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 25 },
        email: { type: String, required: true, unique: true },
        password: {
            type: String, required: function (): boolean {
                return this.provider === ProviderEnum.SYSTEM
            }
        },
        confirmEmailOtp: { type: String },
        confirmEmail: { type: Date },
        profilePicture: { type: String },

        resetPasswordOtp: { type: String },
        phone: { type: String, required: true },
        address: { type: String },
        gender: { type: String, enum: Object.values(GenderEnum), default: GenderEnum.MALE },
        role: { type: String, enum: Object.values(RoleEnum), default: RoleEnum.USER },
        changeCredentialsTime: { type: Date },
        provider: {
            type: String,
            enum: Object.values(ProviderEnum),
            default: ProviderEnum.SYSTEM
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("username").set(function (value: string) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.pre("validate", function () {
    this.email = this.email.toLocaleLowerCase().trim()
})

userSchema.pre("save", async function (this: HUserDocument & { wasNew: boolean }) {
    this.wasNew = this.isNew
    if (this.isModified("password")) {
        this.password = await generateHash(this.password)
    }
    if (this.isModified("phone")) {
        this.phone = await encrypt(this.phone)
    }
})

userSchema.post("save", async function () {
    const that = this as HUserDocument & { wasNew: boolean }
    if (that.wasNew) {
        await emailEvents.emit("confirmEmail", { otp: generateOtp(), to: this.email, username: this.username })
    }
})
userSchema.post("insertMany", async function (docs, next) {
    next()
})


export const userModel = mongoose.model<IUser>("User", userSchema);
export type HUserDocument = HydratedDocument<IUser>;


