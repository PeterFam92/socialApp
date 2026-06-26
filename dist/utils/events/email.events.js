"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvents = void 0;
const node_events_1 = require("node:events");
const generateHtml_1 = require("../email/generateHtml");
const email_utils_1 = require("../email/email.utils");
exports.emailEvents = new node_events_1.EventEmitter();
exports.emailEvents.on("confirmEmail", async (data) => {
    try {
        data.subject = "confirm your email";
        data.html = (0, generateHtml_1.template)(data.otp, data.username, data.subject);
        await (0, email_utils_1.sendEmail)(data);
    }
    catch (error) {
        console.log(`fail to send email`, error);
    }
});
