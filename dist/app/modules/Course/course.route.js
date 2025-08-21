"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = require("express");
const course_controller_1 = require("./course.controller");
const router = (0, express_1.Router)();
router.post("/create", course_controller_1.CourseControllers.createCourse);
router.get("/", course_controller_1.CourseControllers.getAllCourses);
router.patch("/:courseId/published-status", course_controller_1.CourseControllers.updatePublishedStatus);
exports.CourseRoutes = router;
//# sourceMappingURL=course.route.js.map