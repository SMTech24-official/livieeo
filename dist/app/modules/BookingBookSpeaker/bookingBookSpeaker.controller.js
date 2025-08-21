"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingBookSpeakerControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const bookingBookSpeaker_service_1 = require("./bookingBookSpeaker.service");
const http_status_1 = __importDefault(require("http-status"));
const createBookingBookSpeaker = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bookingBookSpeaker_service_1.BookingBookSpeakerServices.createBookingBookSpeakerIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Book speaker booking request sent successfully !`,
        data: result,
    });
});
exports.BookingBookSpeakerControllers = {
    createBookingBookSpeaker
};
//# sourceMappingURL=bookingBookSpeaker.controller.js.map