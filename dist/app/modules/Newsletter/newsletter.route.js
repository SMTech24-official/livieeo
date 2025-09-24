"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const router = (0, express_1.Router)();
router.post("/subscribe-newsletter", newsletter_controller_1.NewsletterControllers.saveContact);
exports.NewsletterRoutes = router;
//# sourceMappingURL=newsletter.route.js.map