"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../db/models/user.model");
const user_repo_1 = require("../../db/repositories/user.repo");
const error_response_1 = require("../../utils/response/error.response");
const hash_1 = require("../../utils/security/hash");
const generateOTP_1 = require("../../utils/security/generateOTP");
const email_events_1 = require("../../utils/events/email.events");
const token_1 = require("../../utils/services/token");
const auth_enum_1 = require("../../utils/enums/auth.enum");
const google_auth_library_1 = require("google-auth-library");
const config_service_1 = require("../../config/config.service");
const redis_service_1 = require("../../db/redis.service");
const config_service_2 = require("../../config/config.service");
const notification_service_1 = require("../../utils/services/notification.service");
class AuthenticationService {
    _userRepo = new user_repo_1.userRepository(user_model_1.userModel);
    _tokenService;
    constructor() {
        this._tokenService = new token_1.tokenService();
    }
    signup = async (req, res) => {
        const { username, email, password, phone } = req.body;
        const checkUser = await this._userRepo.findOne({
            filter: { email },
            select: "email"
        });
        if (checkUser)
            throw new error_response_1.ConflictRequestException("user Already exists");
        const otp = (0, generateOTP_1.generateOtp)();
        const user = await this._userRepo.create({
            data: [{
                    username,
                    email,
                    password,
                    phone,
                    confirmEmailOtp: await (0, hash_1.generateHash)(otp.toString())
                }],
            options: { validateBeforeSave: true }
        });
        await email_events_1.emailEvents.emit("confirmEmail", { to: email, username, otp });
        return res.status(201).json({ message: "user created successfully", data: { user } });
    };
    login = async (req, res) => {
        const { email, password, FCM } = req.body;
        const user = await this._userRepo.findOne({ filter: { email, confirmEmail: { $exists: true } } });
        if (!user)
            throw new error_response_1.NotFoundException("user not found or not confirmed");
        if (!await (0, hash_1.compareHash)(password, user.password))
            throw new error_response_1.BadRequestException("invalid email or password");
        if (FCM) {
            await (0, redis_service_1.addFCM)(user._id, FCM);
            const tokens = await (0, redis_service_1.getFCM)(user._id);
            if (tokens?.length) {
                // send notifications to stored FCM tokens
                await notification_service_1.notification.sendNotifications({
                    tokens,
                    data: {
                        title: 'login',
                        body: `new login at ${Date.now()}`,
                    },
                });
            }
        }
        const credentials = await this._tokenService.getNewCredentials(user);
        return res.status(201).json({ message: "LOGGED successfully", data: { credentials } });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this._userRepo.findOne({
            filter: { email, confirmEmailOtp: { $exists: true }, confirmEmail: { $exists: false } },
        });
        if (!user)
            throw new error_response_1.NotFoundException("user not found or already confirmed");
        if (!await (0, hash_1.compareHash)(otp, user?.confirmEmailOtp))
            throw new error_response_1.BadRequestException("invalid otp");
        await this._userRepo.updateOne({
            filter: { email },
            update: {
                confirmEmail: new Date(),
                $unset: { confirmEmailOtp: true }
            },
            options: null,
        });
        return res.status(200).json({ message: "user confirmed successfully", data: { user } });
    };
    logoutWithRedis = async (req, res) => {
        const { flag } = req.body;
        let status = 200;
        switch (flag) {
            case auth_enum_1.logOutTypeEnum.LOGOUT:
                await (0, redis_service_1.set)({
                    key: (0, redis_service_1.revokeTokenKey)({ userId: req.decoded.id, jti: req.decoded.jti }),
                    value: req.decoded.jti,
                    ttl: Number(config_service_2.ACCESS_TOKEN_EXPIRATION)
                });
                status = 201;
                break;
            case auth_enum_1.logOutTypeEnum.LOGOUT_FROM_ALL:
                await this._userRepo.updateOne({
                    filter: { _id: req.decoded.id },
                    update: {
                        changeCredentialsTime: Date.now()
                    },
                    options: null
                });
                status = 200;
                break;
        }
        return res.status(status).json({ message: 'logged out successfully' });
    };
    verifyGoogleAccount = async ({ idToken }) => {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: config_service_1.GOOGLE_CLIENT_ID,
        });
        const payLoad = ticket.getPayload();
        return payLoad;
    };
    googleLogin = async (req, res) => {
        const { idToken } = req.body;
        const { email, picture, given_name, family_name, email_verified } = await this.verifyGoogleAccount({ idToken });
        if (!email_verified) {
            throw new error_response_1.BadRequestException("email not verified");
        }
        const user = await this._userRepo.findOne({ filter: { email } });
        if (user) {
            // login
            if (user.provider === auth_enum_1.ProviderEnum.GOOGLE) {
                const credentials = await this._tokenService.getNewCredentials(user);
                return res.status(200).json({ message: "login successfully", data: { credentials } });
            }
        }
        // create user
        const newUser = await this._userRepo.create({
            data: [
                {
                    firstName: given_name,
                    lastName: family_name,
                    email,
                    profilePicture: picture,
                    provider: auth_enum_1.ProviderEnum.GOOGLE,
                },
            ],
        });
        const credentials = await this._tokenService.getNewCredentials(newUser);
        return res.status(201).json({ message: "login successfully", data: { credentials } });
    };
}
exports.default = new AuthenticationService();
