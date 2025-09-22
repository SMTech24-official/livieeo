import { Router } from "express";
import { CourseControllers } from "./course.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  textToJSONParser,
  CourseControllers.createCourse
);
router.get("/", CourseControllers.getAllCourses);
router.get("/published-courses", CourseControllers.getPublishedCourses);
router.patch(
  "/:courseId/published-status",
  auth(UserRole.ADMIN),
  CourseControllers.updatePublishedStatus
);
router.delete(
  "/:courseId",
  auth(UserRole.ADMIN),
  CourseControllers.deleteCourse
);
router.put("/:courseId", auth(UserRole.ADMIN), CourseControllers.updateCourse);
router.get("/:courseId/related-courses", CourseControllers.getRelatedCourses);
// router.get("/:courseId",auth(UserRole.USER),auth(UserRole.ADMIN,UserRole.USER), CourseControllers.getSingleCourse);
router.get(
  "/:courseId",
  auth(UserRole.ADMIN, UserRole.USER),
  CourseControllers.getSingleCourse
);

export const CourseRoutes = router;
