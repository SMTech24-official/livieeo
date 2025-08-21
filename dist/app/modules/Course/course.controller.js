"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const course_service_1 = require("./course.service");
const createCourse = (0, catchAsync_1.default)(async (req, res) => {
    const result = await course_service_1.CourseServices.createCourseIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Course created successfully`,
        data: result,
    });
});
const getAllCourses = (0, catchAsync_1.default)(async (req, res) => {
    const result = await course_service_1.CourseServices.getAllCoursesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Courses retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const updatePublishedStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    const { status } = req.body;
    const result = await course_service_1.CourseServices.updatePublishedStatus(courseId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course published status updated successfully`,
        data: result,
    });
});
exports.CourseControllers = {
    createCourse,
    getAllCourses,
    updatePublishedStatus
};
//# sourceMappingURL=course.controller.js.map