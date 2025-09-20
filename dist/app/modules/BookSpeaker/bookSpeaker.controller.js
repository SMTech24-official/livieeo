"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSpeakerControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const bookSpeaker_service_1 = require("./bookSpeaker.service");
const http_status_1 = __importDefault(require("http-status"));
const createBookSpeaker = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bookSpeaker_service_1.BookSpeakerServices.createBookSpeakerIntoDB(req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Book speaker created successfully`,
        data: result
    });
});
const getAllBookSpeaker = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bookSpeaker_service_1.BookSpeakerServices.getAllBookSpeakerFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book speakers retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getBookSpeakerById = (0, catchAsync_1.default)(async (req, res) => {
    const { speakerId } = req.params;
    const result = await bookSpeaker_service_1.BookSpeakerServices.getBookSpeakerByIdFromDB(speakerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book speaker retrieved successfully`,
        data: result
    });
});
const updateBookSpeaker = (0, catchAsync_1.default)(async (req, res) => {
    const { speakerId } = req.params;
    const result = await bookSpeaker_service_1.BookSpeakerServices.updateBookSpeakerIntoDB(speakerId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book speaker updated successfully`,
        data: result
    });
});
const deleteBookSpeaker = (0, catchAsync_1.default)(async (req, res) => {
    const { speakerId } = req.params;
    const result = await bookSpeaker_service_1.BookSpeakerServices.deleteBookSpeakerFromDB(speakerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book speaker deleted successfully`,
        data: result
    });
});
exports.BookSpeakerControllers = {
    createBookSpeaker,
    getAllBookSpeaker,
    getBookSpeakerById,
    updateBookSpeaker,
    deleteBookSpeaker
};
//# sourceMappingURL=bookSpeaker.controller.js.map