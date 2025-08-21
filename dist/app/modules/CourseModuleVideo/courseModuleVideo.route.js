"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleVideoRoutes = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const courseModuleVideo_controller_1 = require("./courseModuleVideo.controller");
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.single("video"), textToJsonParser_1.default, courseModuleVideo_controller_1.CourseModuleVideoControllers.createCourseModuleVideo);
router.get("/", courseModuleVideo_controller_1.CourseModuleVideoControllers.getAllCourseModuleVideos);
router.get("/:id", courseModuleVideo_controller_1.CourseModuleVideoControllers.getCourseModuleVideoById);
router.patch("/:id", textToJsonParser_1.default, courseModuleVideo_controller_1.CourseModuleVideoControllers.updateCourseModuleVideo);
router.delete("/:id", courseModuleVideo_controller_1.CourseModuleVideoControllers.deleteCourseModuleVideo);
exports.CourseModuleVideoRoutes = router;
//# sourceMappingURL=courseModuleVideo.route.js.map