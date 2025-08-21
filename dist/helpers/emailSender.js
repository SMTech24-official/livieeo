"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const emailSender = async ({ subject, email, html }) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_1.default.emailSender.email,
            pass: config_1.default.emailSender.app_pass,
        },
    });
    const emailTransport = transporter;
    const mailOptions = {
        from: `"" <${config_1.default.emailSender.email}>`,
        to: email,
        subject,
        html,
    };
    // Send the email
    try {
        const info = await emailTransport.sendMail(mailOptions);
        // console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError_1.default(500, "Error sending email");
    }
};
exports.EmailSender = { emailSender };
//# sourceMappingURL=emailSender.js.map