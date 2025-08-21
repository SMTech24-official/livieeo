"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinksRoutes = void 0;
const express_1 = require("express");
const socialLinks_controller_1 = require("./socialLinks.controller");
const router = (0, express_1.Router)();
router.post("/create", socialLinks_controller_1.SocialLinksControllers.createSocialLinks);
router.patch("/:id", socialLinks_controller_1.SocialLinksControllers.updateSocialLinks);
router.delete("/:id", socialLinks_controller_1.SocialLinksControllers.deleteSocialLinks);
router.get("/:id", socialLinks_controller_1.SocialLinksControllers.getSocialLinkById);
router.get("/", socialLinks_controller_1.SocialLinksControllers.getSocialLinks);
exports.SocialLinksRoutes = router;
//# sourceMappingURL=socialLinks.route.js.map