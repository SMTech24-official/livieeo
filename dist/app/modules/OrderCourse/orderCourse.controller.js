"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCourseControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const orderCourse_service_1 = require("./orderCourse.service");
const createCourseOrder = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const result = await orderCourse_service_1.OrderCourseServices.createCourseOrderIntoDB(payload, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course order created successfully",
        data: result
    });
});
const getAllOrderedCourses = (0, catchAsync_1.default)(async (req, res) => {
    const result = await orderCourse_service_1.OrderCourseServices.getAllOrderedCoursesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Ordered courses retrieved successfully",
        data: result
    });
});
const getMyOrderedCourses = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await orderCourse_service_1.OrderCourseServices.getMyOrderedCoursesFromDB(req.query, user.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "My Ordered courses retrieved successfully",
        data: result
    });
});
exports.OrderCourseControllers = {
    createCourseOrder,
    getAllOrderedCourses,
    getMyOrderedCourses
};
//# sourceMappingURL=orderCourse.controller.js.map