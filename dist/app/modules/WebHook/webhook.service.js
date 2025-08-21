"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookServices = void 0;
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const stripe_1 = __importDefault(require("../../../helpers/stripe"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
// handle webhook for payment success
const handleStripeWebHook = async (rawBody, signature) => {
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(rawBody, signature, config_1.default.stripe.webhook_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Webhook Error: " + err.message);
    }
    // handle successful checkout payment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) {
            try {
                await prisma_1.default.orderBook.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: client_1.PaymentStatus.PAID,
                    }
                });
            }
            catch (error) {
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update order status");
            }
        }
    }
    return { recived: true };
};
exports.WebhookServices = {
    handleStripeWebHook
};
//# sourceMappingURL=webhook.service.js.map