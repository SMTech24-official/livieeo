"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
router.get("/total-revenue", dashboard_controller_1.DashboardControllers.totalRevenue);
router.get("/book-sales-count", dashboard_controller_1.DashboardControllers.bookSalesCount);
router.get("/course-enrollments", dashboard_controller_1.DashboardControllers.courseEnrollments);
router.get("/speaking-inquiries", dashboard_controller_1.DashboardControllers.speakingInquires);
router.get("/new-members-this-month", dashboard_controller_1.DashboardControllers.newMemberOfThisMonth);
router.get("/web-visitors-this-month", dashboard_controller_1.DashboardControllers.webVisitorOfThisMonth);
router.get("/recent-activities", dashboard_controller_1.DashboardControllers.getRecentActivities);
router.get("/top-selling-books", dashboard_controller_1.DashboardControllers.getTopSellingBooks);
router.get("/top-selling-courses", dashboard_controller_1.DashboardControllers.getTopSellingCourses);
exports.DashboardRoutes = router;
//# sourceMappingURL=dashboard.route.js.map