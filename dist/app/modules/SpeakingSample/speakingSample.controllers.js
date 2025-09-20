"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeakingSampleControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const speakingSample_service_1 = require("./speakingSample.service");
const http_status_1 = __importDefault(require("http-status"));
const createSpeakingSample = (0, catchAsync_1.default)(async (req, res) => {
    const file = req.file;
    const result = await speakingSample_service_1.SpeakingSampleServices.createSpeakingSampleIntoDB(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Speaking sample created successfully`,
        data: result,
    });
});
const getAllSpeakingSample = (0, catchAsync_1.default)(async (req, res) => {
    const result = await speakingSample_service_1.SpeakingSampleServices.getAllSpeakingSampleFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Speaking samples retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getRelatedSpeakingSample = (0, catchAsync_1.default)(async (req, res) => {
    const { speakingSampleId } = req.params;
    const result = await speakingSample_service_1.SpeakingSampleServices.getRelatedSpeakingSamplesFromDB(speakingSampleId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Related speaking samples retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getSpeakingSampleById = (0, catchAsync_1.default)(async (req, res) => {
    const { speakingSampleId } = req.params;
    const result = await speakingSample_service_1.SpeakingSampleServices.getSpeakingSampleById(speakingSampleId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Speaking sample retrieved successfully`,
        data: result
    });
});
const updateSpeakingSample = (0, catchAsync_1.default)(async (req, res) => {
    const file = req.file;
    console.log(file);
    const reqBody = req.body;
    const { speakingSampleId } = req.params;
    console.log(speakingSampleId);
    const result = await speakingSample_service_1.SpeakingSampleServices.updateSpeakingSampleIntoDB(speakingSampleId, reqBody, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Speaking sample updated successfully`,
        data: result
    });
});
const deleteSpeakingSample = (0, catchAsync_1.default)(async (req, res) => {
    const { speakingSampleId } = req.params;
    const result = await speakingSample_service_1.SpeakingSampleServices.deleteSpeakingSampleFromDB(speakingSampleId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Speaking sample deleted successfully`,
        data: result
    });
});
exports.SpeakingSampleControllers = {
    createSpeakingSample,
    getAllSpeakingSample,
    getSpeakingSampleById,
    updateSpeakingSample,
    deleteSpeakingSample,
    getRelatedSpeakingSample
};
//# sourceMappingURL=speakingSample.controllers.js.map