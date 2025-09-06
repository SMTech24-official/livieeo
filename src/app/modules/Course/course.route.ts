import { Router } from "express";
import { CourseControllers } from "./course.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/create", CourseControllers.createCourse);
router.get("/", CourseControllers.getAllCourses);
router.get("/published-courses", CourseControllers.getPublishedCourses);
router.patch("/:courseId/published-status", CourseControllers.updatePublishedStatus);
router.delete("/:courseId", CourseControllers.deleteCourse);
router.put("/:courseId", CourseControllers.updateCourse);
router.get("/:courseId/related-courses", CourseControllers.getRelatedCourses);
router.get("/:courseId",auth(UserRole.USER), CourseControllers.getSingleCourse);

export const CourseRoutes = router;