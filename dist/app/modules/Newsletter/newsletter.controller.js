"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const newsletter_service_1 = require("./newsletter.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const saveContact = (0, catchAsync_1.default)(async (req, res) => {
    const result = await newsletter_service_1.NewsletterServices.subscribeNewsletter(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Thank you so much for connect with us",
        data: result,
    });
});
exports.NewsletterControllers = {
    saveContact,
};
//# sourceMappingURL=newsletter.controller.js.map