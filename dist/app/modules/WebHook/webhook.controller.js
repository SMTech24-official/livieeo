"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const webhook_service_1 = require("./webhook.service");
const handleStripeWebHook = (0, catchAsync_1.default)(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const result = await webhook_service_1.WebhookServices.handleStripeWebHook(req.body, sig);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Payment paid successfully",
        data: result
    });
});
exports.WebhookControllers = {
    handleStripeWebHook
};
//# sourceMappingURL=webhook.controller.js.map