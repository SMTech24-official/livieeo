"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const newsletter_controller_1 = require("./newsletter.controller");
const router = (0, express_1.Router)();
router.post("/subscribe-newsletter", (0, auth_1.default)(client_1.UserRole.USER), newsletter_controller_1.NewsletterControllers.saveContact);
exports.NewsletterRoutes = router;
//# sourceMappingURL=newsletter.route.js.map