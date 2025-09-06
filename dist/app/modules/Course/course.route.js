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
const router = (0, express_1.Router)();
router.post("/create", course_controller_1.CourseControllers.createCourse);
router.get("/", course_controller_1.CourseControllers.getAllCourses);
router.get("/published-courses", course_controller_1.CourseControllers.getPublishedCourses);
router.patch("/:courseId/published-status", course_controller_1.CourseControllers.updatePublishedStatus);
router.delete("/:courseId", course_controller_1.CourseControllers.deleteCourse);
router.put("/:courseId", course_controller_1.CourseControllers.updateCourse);
router.get("/:courseId/related-courses", course_controller_1.CourseControllers.getRelatedCourses);
router.get("/:courseId", (0, auth_1.default)(client_1.UserRole.USER), course_controller_1.CourseControllers.getSingleCourse);
exports.CourseRoutes = router;
//# sourceMappingURL=course.route.js.map