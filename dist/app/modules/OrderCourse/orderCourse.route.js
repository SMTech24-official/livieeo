"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCourseRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const orderCourse_controller_1 = require("./orderCourse.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, auth_1.default)(client_1.UserRole.USER), orderCourse_controller_1.OrderCourseControllers.createCourseOrder);
router.get("/", orderCourse_controller_1.OrderCourseControllers.getAllOrderedCourses);
router.get("/my-courses", (0, auth_1.default)(client_1.UserRole.USER), orderCourse_controller_1.OrderCourseControllers.getMyOrderedCourses);
exports.OrderCourseRoutes = router;
//# sourceMappingURL=orderCourse.route.js.map