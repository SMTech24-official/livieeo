"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const courseCertificate_service_1 = require("./courseCertificate.service");
const createCourseCertificate = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await courseCertificate_service_1.CourseCertificateServices.createCourseCertificateIntoDB(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Course certificate created successfully",
        data: result,
    });
});
const verifyCourseCertificate = (0, catchAsync_1.default)(async (req, res) => {
    const { code } = req.params;
    const result = await courseCertificate_service_1.CourseCertificateServices.verifyCourseCertificateFromDB(code);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Course certificate verified successfully",
        data: result,
    });
});
const getMyCertificates = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await courseCertificate_service_1.CourseCertificateServices.getMyCertificatesFromDB(req.query, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User's certificates retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
exports.CourseCertificateControllers = {
    createCourseCertificate,
    verifyCourseCertificate,
    getMyCertificates
};
//# sourceMappingURL=courseCertificate.controller.js.map