"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingBookSpeakerServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createBookingBookSpeakerIntoDB = async (payload) => {
    const result = await prisma_1.default.bookingBookSpeaker.create({ data: payload });
    return result;
};
exports.BookingBookSpeakerServices = {
    createBookingBookSpeakerIntoDB
};
//# sourceMappingURL=bookingBookSpeaker.service.js.map