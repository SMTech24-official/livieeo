import { Router } from "express";
import { CourseModuleControllers } from "./courseModule.controller";

const router = Router()

router.post("/create", CourseModuleControllers.createCourseModule);
router.get("/", CourseModuleControllers.getAllCourseModules);

export const CourseModuleRoutes = router;