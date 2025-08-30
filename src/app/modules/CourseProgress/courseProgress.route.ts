import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CourseProgressController } from "./courseProgress.controller";


const router = Router();

// Mark video complete
router.post("/complete-video", auth(UserRole.USER), CourseProgressController.completeVideo);

// Get course progress
router.get("/:courseId/progress", auth(UserRole.USER), CourseProgressController.getProgress);

// “Course Complete” বাটন (সব ভিডিও দেখা আছে কিনা যাচাই + সার্টিফিকেট)
router.post("/complete-course", auth(UserRole.USER), CourseProgressController.completeCourse);
export const CourseProgressRoutes = router;