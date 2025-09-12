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
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// router.post("/create", fileUploader.upload.single("video"), textToJSONParser, CourseModuleVideoControllers.createCourseModuleVideo)
// courseModuleVideo.route.ts
router.post("/create", fileUploader_1.fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, courseModuleVideo_controller_1.CourseModuleVideoControllers.createCourseModuleVideo);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), courseModuleVideo_controller_1.CourseModuleVideoControllers.getAllCourseModuleVideos);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), courseModuleVideo_controller_1.CourseModuleVideoControllers.getCourseModuleVideoById);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, courseModuleVideo_controller_1.CourseModuleVideoControllers.updateCourseModuleVideo);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), courseModuleVideo_controller_1.CourseModuleVideoControllers.deleteCourseModuleVideo);
exports.CourseModuleVideoRoutes = router;
//# sourceMappingURL=courseModuleVideo.route.js.map