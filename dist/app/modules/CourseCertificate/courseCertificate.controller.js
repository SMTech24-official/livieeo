"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const courseCertificate_service_1 = require("./courseCertificate.service");
const http_status_1 = __importDefault(require("http-status"));
const createCourseCertificate = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseCertificate_service_1.CourseCertificateServices.createCourseCertificateIntoDB(req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Course certificate created successfully`,
        data: result,
    });
});
const getAllCourseCertificates = (0, catchAsync_1.default)(async (req, res) => {
    const result = await courseCertificate_service_1.CourseCertificateServices.getAllCourseCertificatesFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Course certificates retrieved successfully`,
        data: result,
    });
});
exports.CourseCertificateControllers = {
    createCourseCertificate,
    getAllCourseCertificates
};
//# sourceMappingURL=courseCertificate.controller.js.map