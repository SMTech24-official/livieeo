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
    const result = await course_service_1.CourseServices.createCourseIntoDB(req.body, req.file);
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
const getPublishedCourses = (0, catchAsync_1.default)(async (req, res) => {
    const result = await course_service_1.CourseServices.getPublishedCoursesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Published courses retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getSingleCourse = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.user) {
        throw new Error("Unauthorized: user not found in request");
    }
    const { courseId } = req.params;
    const userId = req.user.id;
    const result = await course_service_1.CourseServices.getSingleCourseFromDB(courseId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Single course retrieved successfully`,
        data: result,
    });
});
const getRelatedCourses = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    const result = await course_service_1.CourseServices.getRelatedCoursesFromDB(courseId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Related courses retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const updatePublishedStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    const result = await course_service_1.CourseServices.updatePublishedStatus(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course published status updated successfully`,
        data: result,
    });
});
const deleteCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    const result = await course_service_1.CourseServices.deleteCourseFromDB(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course deleted successfully`,
        data: result,
    });
});
const updateCourse = (0, catchAsync_1.default)(async (req, res) => {
    const { courseId } = req.params;
    const payload = req.body;
    const result = await course_service_1.CourseServices.updateCourseIntoDB(courseId, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course updated successfully`,
        data: result,
    });
});
exports.CourseControllers = {
    createCourse,
    getAllCourses,
    getPublishedCourses,
    updatePublishedStatus,
    deleteCourse,
    updateCourse,
    getRelatedCourses,
    getSingleCourse
};
//# sourceMappingURL=course.controller.js.map