"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../db/user.model");
const user_repo_1 = require("../../db/repositories/user.repo");
const error_response_1 = require("../../utils/response/error.response");
const hash_1 = require("../../utils/security/hash");
const encryption_1 = require("../../utils/security/encryption");
class AuthenticationService {
    _userModel = new user_repo_1.userRepository(user_model_1.userModel);
    constructor() { }
    signup = async (req, res) => {
        const { username, email, password, phone } = req.body;
        const checkUser = await this._userModel.findOne({
            filter: { email },
            select: "email"
        });
        if (checkUser)
            throw new error_response_1.ConflictRequestException("user Already exists");
        const user = await this._userModel.create({
            data: [{ username,
                    email,
                    password: await (0, hash_1.generateHash)(password),
                    phone: await (0, encryption_1.encrypt)(phone)
                }],
            options: { validateBeforeSave: true }
        });
        return res.status(201).json({ message: "user created successfully", data: { user } });
    };
}
exports.default = new AuthenticationService();
