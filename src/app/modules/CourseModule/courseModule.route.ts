import { Router } from "express";
import { CourseModuleControllers } from "./courseModule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  CourseModuleControllers.createCourseModule
);
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  CourseModuleControllers.updateCourseModule
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CourseModuleControllers.deleteCourseModule
);

router.get(
  "/:id",
  auth(UserRole.ADMIN),
  CourseModuleControllers.getCourseModuleById
);
router.get(
  "/",
  auth(UserRole.ADMIN),
  CourseModuleControllers.getAllCourseModules
);

export const CourseModuleRoutes = router;
