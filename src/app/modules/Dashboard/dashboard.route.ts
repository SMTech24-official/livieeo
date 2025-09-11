import { Router } from "express";
import { DashboardControllers } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.get("/dashboard-stats",auth(UserRole.ADMIN), DashboardControllers.dashboardStats)
router.get("/recent-activities",auth(UserRole.ADMIN), DashboardControllers.getRecentActivities)
router.get("/top-selling-books",auth(UserRole.ADMIN), DashboardControllers.getTopSellingBooks)
router.get("/top-selling-courses",auth(UserRole.ADMIN), DashboardControllers.getTopSellingCourses)

export const DashboardRoutes = router;