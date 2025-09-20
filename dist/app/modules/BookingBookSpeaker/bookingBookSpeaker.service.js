"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingBookSpeakerServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const createBookingBookSpeakerIntoDB = async (payload, user) => {
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "user not found");
    }
    payload.userId = user.id;
    const result = await prisma_1.default.bookingBookSpeaker.create({ data: payload });
    return result;
};
const getAllBookingBookSpeakersFromDB = async (query, userId) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.bookingBookSpeaker, query);
    const bookings = await queryBuilder
        .search(["date", "time"])
        .filter(["date", "time"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: bookings };
};
exports.BookingBookSpeakerServices = {
    createBookingBookSpeakerIntoDB,
    getAllBookingBookSpeakersFromDB
};
//# sourceMappingURL=bookingBookSpeaker.service.js.map