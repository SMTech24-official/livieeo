"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const education_service_1 = require("./education.service");
const http_status_1 = __importDefault(require("http-status"));
const createEducation = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await education_service_1.EducationServices.createEducationIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Education created successfully",
        data: result
    });
});
const updateEducation = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await education_service_1.EducationServices.updateEducationIntoDB(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Education updated successfully",
        data: result
    });
});
const deleteEducation = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await education_service_1.EducationServices.deleteEducationFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Education deleted successfully",
        data: result
    });
});
const getEducationById = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await education_service_1.EducationServices.getEducationByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Education retrieved successfully",
        data: result
    });
});
const getEducations = (0, catchAsync_1.default)(async (req, res) => {
    const result = await education_service_1.EducationServices.getEducationsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Educations retrieved successfully",
        data: result
    });
});
exports.EducationControllers = {
    createEducation,
    updateEducation,
    deleteEducation,
    getEducationById,
    getEducations
};
//# sourceMappingURL=education.controller.js.map