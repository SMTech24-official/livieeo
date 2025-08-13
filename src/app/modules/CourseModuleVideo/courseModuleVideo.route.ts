import { Router } from "express"
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { CourseModuleVideoControllers } from "./courseModuleVideo.controller";

const router = Router()

router.post("/create", fileUploader.upload.single("video"), textToJSONParser, CourseModuleVideoControllers.createCourseModuleVideo)
router.get("/", CourseModuleVideoControllers.getAllCourseModuleVideos)
router.get("/:id", CourseModuleVideoControllers.getCourseModuleVideoById)
router.patch("/:id", textToJSONParser, CourseModuleVideoControllers.updateCourseModuleVideo)
router.delete("/:id", CourseModuleVideoControllers.deleteCourseModuleVideo)

export const CourseModuleVideoRoutes = router; 