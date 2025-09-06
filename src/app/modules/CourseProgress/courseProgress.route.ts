import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CourseProgressController } from "./courseProgress.controller";


const router = Router();

// Mark video complete
router.post("/complete-video", auth(UserRole.USER), CourseProgressController.completeVideo);

export const CourseProgressRoutes = router;