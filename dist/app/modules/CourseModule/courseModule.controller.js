"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const courseModule_service_1 = require("./courseModule.service");
const http_status_1 = __importDefault(require("http-status"));
const createCourseModule = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseModule_service_1.CourseModuleServices.createCourseModuleIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Course module created successfully`,
        data: result,
    });
});
const getAllCourseModules = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseModule_service_1.CourseModuleServices.getAllCourseModulesFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course modules retrieved successfully`,
        data: result,
    });
});
const getCourseModuleById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseModule_service_1.CourseModuleServices.getCourseModuleByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course module retrieved successfully`,
        data: result,
    });
});
exports.CourseModuleControllers = {
    createCourseModule,
    getAllCourseModules,
    getCourseModuleById
};
//# sourceMappingURL=courseModule.controller.js.map