"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userService {
    constructor() { }
    getProfile = async (req, res) => {
        return res.status(200).json({ message: "done", data: req.user });
    };
}
exports.default = new userService;
