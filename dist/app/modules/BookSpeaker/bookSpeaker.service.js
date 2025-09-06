"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSpeakerServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBookSpeakerIntoDB = async (payload, file) => {
    const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
    const result = await prisma_1.default.bookSpeaker.create({
        data: {
            ...payload,
            imageUrl: uploadToCloudinary?.secure_url ?? "",
        },
    });
    return result;
};
const getAllBookSpeakerFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.bookSpeaker, query);
    const bookSpeakers = await queryBuilder
        .range()
        .search(["name", "profession", "expertise"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    return { meta, data: bookSpeakers };
};
const getBookSpeakerByIdFromDB = async (speakerId) => {
    const result = await prisma_1.default.bookSpeaker.findUniqueOrThrow({
        where: {
            id: speakerId
        }
    });
    return result;
};
const updateBookSpeakerIntoDB = async (speakerId, payload) => {
    const bookSpeaker = await prisma_1.default.bookSpeaker.findUnique({
        where: {
            id: speakerId
        }
    });
    if (!bookSpeaker) {
        throw new ApiError_1.default(404, "Book speaker not found");
    }
    const result = await prisma_1.default.bookSpeaker.update({
        where: {
            id: speakerId
        },
        data: payload
    });
    return result;
};
const deleteBookSpeakerFromDB = async (speakerId) => {
    const bookSpeaker = await prisma_1.default.bookSpeaker.findUnique({
        where: {
            id: speakerId
        }
    });
    if (!bookSpeaker) {
        throw new ApiError_1.default(404, "Book speaker not found");
    }
    await prisma_1.default.bookSpeaker.delete({
        where: {
            id: speakerId
        }
    });
    return { message: "Book speaker deleted successfully" };
};
exports.BookSpeakerServices = {
    createBookSpeakerIntoDB,
    getAllBookSpeakerFromDB,
    getBookSpeakerByIdFromDB,
    updateBookSpeakerIntoDB,
    deleteBookSpeakerFromDB
};
//# sourceMappingURL=bookSpeaker.service.js.map