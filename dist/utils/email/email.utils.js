"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const config_service_1 = require("../../config/config.service");
const error_response_1 = require("../response/error.response");
const sendEmail = async (data) => {
    if (!data.html && !data.attachments && !data.text) {
        throw new error_response_1.BadRequestException("missing email content");
    }
    const transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: {
            user: config_service_1.user_Email,
            pass: config_service_1.user_Password
        }
    });
    const info = await transporter.sendMail({
        ...data,
        from: `"Academy"<${config_service_1.user_Email}`
    });
};
exports.sendEmail = sendEmail;
