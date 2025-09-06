"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const courseProgress_controller_1 = require("./courseProgress.controller");
const router = (0, express_1.Router)();
// Mark video complete
router.post("/complete-video", (0, auth_1.default)(client_1.UserRole.USER), courseProgress_controller_1.CourseProgressController.completeVideo);
exports.CourseProgressRoutes = router;
//# sourceMappingURL=courseProgress.route.js.map