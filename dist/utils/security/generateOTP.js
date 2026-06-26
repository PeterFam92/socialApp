"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
function generateOtp() {
    return Math.floor(Math.random() * 900000 + 100000);
}
