"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const orderBook_service_1 = require("./orderBook.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createBookOrder = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const result = await orderBook_service_1.OrderBookServices.createBookOrderIntoDB(payload, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Book order created successfully",
        data: result
    });
});
const getAllOrderedBooks = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const result = await orderBook_service_1.OrderBookServices.getAllOrderedBooksFromDB(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Ordered books retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});
const getMyOrderedBooks = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await orderBook_service_1.OrderBookServices.getMyOrderedBooksFromDB(req.query, user.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Ordered books retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});
exports.OrderBookControllers = {
    createBookOrder,
    getAllOrderedBooks,
    getMyOrderedBooks
};
//# sourceMappingURL=orderBook.controller.js.map