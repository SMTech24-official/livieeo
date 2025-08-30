import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CourseProgressController } from "./courseProgress.controller";


const router = Router();

// Mark video complete
router.post("/complete-video", auth(UserRole.USER, UserRole.ADMIN), CourseProgressController.completeVideo);

// Get course progress
router.get("/:courseId", auth(UserRole.USER, UserRole.ADMIN), CourseProgressController.getProgress);

export const CourseProgressRoutes = router;