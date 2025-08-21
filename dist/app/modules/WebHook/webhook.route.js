"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHookRoutes = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const webhook_controller_1 = require("./webhook.controller");
const router = (0, express_1.Router)();
router.post("/stripe/webhook", express_2.default.raw({ type: "application/json" }), webhook_controller_1.WebhookControllers.handleStripeWebHook);
exports.WebHookRoutes = router;
//# sourceMappingURL=webhook.route.js.map