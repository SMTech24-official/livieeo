"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const courseProgress_service_1 = require("./courseProgress.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const completeVideo = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { courseId, videoId } = req.body;
    const result = await courseProgress_service_1.CourseProgressServices.completeVideo(user.id, courseId, videoId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Video completed successfully",
        data: result,
    });
});
exports.CourseProgressController = { completeVideo };
//# sourceMappingURL=courseProgress.controller.js.map