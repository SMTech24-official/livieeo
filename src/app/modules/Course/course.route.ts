import { Router } from "express";
import { CourseControllers } from "./course.controller";

const router = Router();

router.post("/create", CourseControllers.createCourse);
router.get("/", CourseControllers.getAllCourses);
router.get("/published-courses", CourseControllers.getPublishedCourses);
router.patch("/:courseId/published-status", CourseControllers.updatePublishedStatus);
router.delete("/:courseId", CourseControllers.deleteCourse);
router.put("/:courseId", CourseControllers.updateCourse);

export const CourseRoutes = router;