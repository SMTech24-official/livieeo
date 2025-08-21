"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const book_service_1 = require("./book.service");
const http_status_1 = __importDefault(require("http-status"));
const createBook = (0, catchAsync_1.default)(async (req, res) => {
    const files = req.files;
    const bookFile = files.book ? files.book[0] : undefined;
    const bookCoverFile = files.bookCover ? files.bookCover[0] : undefined;
    const result = await book_service_1.BookServices.createBookIntoDB(req.body, bookFile, bookCoverFile);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Book created successfully`,
        data: result,
    });
});
const getAllBooks = (0, catchAsync_1.default)(async (req, res) => {
    const result = await book_service_1.BookServices.getAllBooksFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Books retrieved successfully`,
        data: result,
    });
});
const getBookById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await book_service_1.BookServices.getBookByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book retrieved successfully`,
        data: result,
    });
});
const updateBook = (0, catchAsync_1.default)(async (req, res) => {
    const result = await book_service_1.BookServices.updateBookInDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book updated successfully`,
        data: result,
    });
});
const deleteBook = (0, catchAsync_1.default)(async (req, res) => {
    const result = await book_service_1.BookServices.deleteBookFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book deleted successfully`,
        data: result,
    });
});
const updatePublishedStatus = (0, catchAsync_1.default)(async (req, res) => {
    const result = await book_service_1.BookServices.updatePublishedStatus(req.params.id, req.body.isPublished);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Book published status updated successfully`,
        data: result,
    });
});
exports.BookControllers = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    updatePublishedStatus
};
//# sourceMappingURL=book.controller.js.map