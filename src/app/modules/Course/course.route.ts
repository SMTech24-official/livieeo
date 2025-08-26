import { Router } from "express";
import { CourseControllers } from "./course.controller";

const router = Router();

router.post("/create", CourseControllers.createCourse);
router.get("/", CourseControllers.getAllCourses);
router.get("/published-courses", CourseControllers.getPublishedCourses);
router.patch("/:courseId/published-status", CourseControllers.updatePublishedStatus);

export const CourseRoutes = router;