"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const router = (0, express_1.Router)();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, course_controller_1.CourseControllers.createCourse);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), course_controller_1.CourseControllers.getAllCourses);
router.get("/published-courses", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), course_controller_1.CourseControllers.getPublishedCourses);
router.patch("/:courseId/published-status", (0, auth_1.default)(client_1.UserRole.ADMIN), course_controller_1.CourseControllers.updatePublishedStatus);
router.delete("/:courseId", (0, auth_1.default)(client_1.UserRole.ADMIN), course_controller_1.CourseControllers.deleteCourse);
router.put("/:courseId", (0, auth_1.default)(client_1.UserRole.ADMIN), course_controller_1.CourseControllers.updateCourse);
router.get("/:courseId/related-courses", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), course_controller_1.CourseControllers.getRelatedCourses);
router.get("/:courseId", (0, auth_1.default)(client_1.UserRole.USER), (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), course_controller_1.CourseControllers.getSingleCourse);
exports.CourseRoutes = router;
//# sourceMappingURL=course.route.js.map