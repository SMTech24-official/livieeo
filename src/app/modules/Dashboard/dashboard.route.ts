import { Router } from "express";
import { DashboardControllers } from "./dashboard.controller";

const router = Router()

router.get("/total-revenue", DashboardControllers.totalRevenue)
router.get("/book-sales-count", DashboardControllers.bookSalesCount)
router.get("/course-enrollments", DashboardControllers.courseEnrollments)
router.get("/speaking-inquiries", DashboardControllers.speakingInquires)
router.get("/new-members-this-month", DashboardControllers.newMemberOfThisMonth)
router.get("/web-visitors-this-month", DashboardControllers.webVisitorOfThisMonth)
router.get("/recent-activities", DashboardControllers.getRecentActivities)
router.get("/top-selling-books", DashboardControllers.getTopSellingBooks)
router.get("/top-selling-courses", DashboardControllers.getTopSellingCourses)

export const DashboardRoutes = router;