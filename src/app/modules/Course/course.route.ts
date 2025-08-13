import { Router } from "express";
import { CourseControllers } from "./course.controller";

const router = Router();

router.post("/create", CourseControllers.createCourse);
router.get("/", CourseControllers.getAllCourses);

export const CourseRoutes = router;