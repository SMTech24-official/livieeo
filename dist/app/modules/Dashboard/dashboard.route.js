"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/dashboard-stats", (0, auth_1.default)(client_1.UserRole.ADMIN), dashboard_controller_1.DashboardControllers.dashboardStats);
router.get("/recent-activities", (0, auth_1.default)(client_1.UserRole.ADMIN), dashboard_controller_1.DashboardControllers.getRecentActivities);
router.get("/top-selling-books", (0, auth_1.default)(client_1.UserRole.ADMIN), dashboard_controller_1.DashboardControllers.getTopSellingBooks);
router.get("/top-selling-courses", (0, auth_1.default)(client_1.UserRole.ADMIN), dashboard_controller_1.DashboardControllers.getTopSellingCourses);
exports.DashboardRoutes = router;
//# sourceMappingURL=dashboard.route.js.map