import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { CourseModuleVideoControllers } from "./courseModuleVideo.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// router.post("/create", fileUploader.upload.single("video"), textToJSONParser, CourseModuleVideoControllers.createCourseModuleVideo)

// courseModuleVideo.route.ts
router.post(
  "/create",
  fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 20 }, // multiple thumbs
    { name: "video", maxCount: 20 }, // multiple videos
  ]),
  auth(UserRole.ADMIN),
  textToJSONParser,
  CourseModuleVideoControllers.createCourseModuleVideo
);

router.get(
  "/",
  auth(UserRole.ADMIN),
  CourseModuleVideoControllers.getAllCourseModuleVideos
);
router.get(
  "/:id",
  auth(UserRole.ADMIN),
  CourseModuleVideoControllers.getCourseModuleVideoById
);
router.put(
  "/:id",
  fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 1 }, // single thumb
    { name: "video", maxCount: 1 }, // single video
  ]),
  auth(UserRole.ADMIN),
  textToJSONParser,
  CourseModuleVideoControllers.updateCourseModuleVideo
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CourseModuleVideoControllers.deleteCourseModuleVideo
);

export const CourseModuleVideoRoutes = router;
