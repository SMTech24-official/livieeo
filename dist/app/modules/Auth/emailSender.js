"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const emailSender = async (email, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.emailSender.email,
            pass: config_1.default.emailSender.app_pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const info = await transporter.sendMail({
        from: '"Livieeo" <azharmahmud730@gmail.com>',
        to: email,
        subject: subject,
        html,
    });
    return info;
};
exports.default = emailSender;
//# sourceMappingURL=emailSender.js.map