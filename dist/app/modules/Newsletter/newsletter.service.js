"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const emailSender_1 = __importDefault(require("../Auth/emailSender"));
const subscribeNewsletter = async (payload) => {
    const existSubscribe = await prisma_1.default.newsletter.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (existSubscribe) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "You are already subscribed");
    }
    const result = await prisma_1.default.newsletter.create({
        data: payload,
    });
    await (0, emailSender_1.default)(payload.email, "Newsletter Subscription", `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Newsletter Subscription</title>
<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f7fa;
        color: #333333;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
        background-color: #4f46e5; /* Indigo-600 */
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .content {
        padding: 30px 20px;
        line-height: 1.6;
        font-size: 16px;
    }
    .content p {
        margin: 15px 0;
    }
    .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
    }
    .footer {
        background-color: #f5f7fa;
        color: #888888;
        text-align: center;
        padding: 15px;
        font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
        .container {
            margin: 20px;
        }
        .header {
            font-size: 20px;
        }
        .content {
            font-size: 15px;
        }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        Welcome to Our Newsletter
    </div>
    <div class="content">
        <p>Hi,</p>
        <p>Thank you for subscribing to our newsletter! We're excited to have you onboard.</p>
        <p>You'll now receive the latest updates, tips, and exclusive offers directly in your inbox.</p>
    </div>
    <div class="footer">
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </div>
</div>
</body>
</html>
`);
    return result;
};
exports.NewsletterServices = {
    subscribeNewsletter,
};
//# sourceMappingURL=newsletter.service.js.map