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
const subscribeNewsletter = async (user) => {
    const existSubscribe = await prisma_1.default.newsletter.findUnique({
        where: {
            email: user.email
        }
    });
    if (existSubscribe) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "You are already subscribe");
    }
    const subscribedUserData = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
    };
    const result = await prisma_1.default.newsletter.create({
        data: subscribedUserData
    });
    await (0, emailSender_1.default)(user.email, "Newsletter Subscription", `
        <h2>Welcome to our Newsletter!</h2>
        <p>Thanks for subscribing. You'll now receive regular updates from us.</p>
        `);
    return result;
};
exports.NewsletterServices = {
    subscribeNewsletter
};
//# sourceMappingURL=newsletter.service.js.map