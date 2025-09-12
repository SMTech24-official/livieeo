"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleVideoControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const courseModuleVideo_service_1 = require("./courseModuleVideo.service");
const http_status_1 = __importDefault(require("http-status"));
// const createCourseModuleVideo = catchAsync(async (req, res) => {
//     const file = req.file as IFile;
//     const result = await CourseModuleVideoServices.createCourseModuleVideoIntoDB(req.body, file);
//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: `Course Module Video created successfully`,
//         data: result,
//     });
// })
// courseModuleVideo.controller.ts
const createCourseModuleVideo = (0, catchAsync_1.default)(async (req, res) => {
    const files = req.files;
    const thumbImageFile = files.thumbImage ? files.thumbImage[0] : undefined;
    const videoFile = files.video ? files.video[0] : undefined;
    const result = await courseModuleVideo_service_1.CourseModuleVideoServices.createCourseModuleVideoIntoDB(req.body, thumbImageFile, videoFile);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Course Module Video created successfully`,
        data: result,
    });
});
const getAllCourseModuleVideos = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseModuleVideo_service_1.CourseModuleVideoServices.getAllCourseModuleVideosFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course Module Videos retrieved successfully`,
        data: result,
    });
});
const getCourseModuleVideoById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await courseModuleVideo_service_1.CourseModuleVideoServices.getCourseModuleVideoByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course Module Video retrieved successfully`,
        data: result,
    });
});
const updateCourseModuleVideo = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await courseModuleVideo_service_1.CourseModuleVideoServices.updateCourseModuleVideoInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course Module Video updated successfully`,
        data: result,
    });
});
const deleteCourseModuleVideo = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await courseModuleVideo_service_1.CourseModuleVideoServices.deleteCourseModuleVideoFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course Module Video deleted successfully`,
        data: result,
    });
});
exports.CourseModuleVideoControllers = {
    createCourseModuleVideo,
    getAllCourseModuleVideos,
    getCourseModuleVideoById,
    updateCourseModuleVideo,
    deleteCourseModuleVideo
};
//# sourceMappingURL=courseModuleVideo.controller.js.map