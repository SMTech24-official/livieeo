"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createBookIntoDB = async (payload, book, bookCover) => {
    if (book) {
        const uploadBook = await fileUploader_1.fileUploader.uploadToCloudinary(book);
        payload.book = uploadBook?.secure_url ?? "";
    }
    if (bookCover) {
        const uploadBookCover = await fileUploader_1.fileUploader.uploadToCloudinary(bookCover);
        payload.bookCover = uploadBookCover?.secure_url ?? "";
    }
    const result = await prisma_1.default.book.create({
        data: payload
    });
    return result;
};
const getAllBooksFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.book, query);
    const books = await queryBuilder
        .range()
        .search(["bookName"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError_1.default(404, "No books found");
    }
    return { meta, data: books };
};
const getBookByIdFromDB = async (id) => {
    const result = await prisma_1.default.book.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
};
const updateBookInDB = async (id, payload) => {
    const book = await prisma_1.default.book.findUnique({
        where: {
            id
        }
    });
    if (!book) {
        throw new ApiError_1.default(404, "Book not found!");
    }
    const result = await prisma_1.default.book.update({
        where: { id },
        data: payload
    });
    return result;
};
const deleteBookFromDB = async (id) => {
    const book = await prisma_1.default.book.findUnique({
        where: {
            id
        }
    });
    if (!book) {
        throw new ApiError_1.default(404, "Book not found!");
    }
    const result = await prisma_1.default.book.delete({
        where: { id }
    });
    return result;
};
const updatePublishedStatus = async (id, status) => {
    const book = await prisma_1.default.book.findUnique({
        where: {
            id
        }
    });
    if (!book) {
        throw new ApiError_1.default(404, "Book not found!");
    }
    const result = await prisma_1.default.book.update({
        where: { id },
        data: { isPublished: status }
    });
    return result;
};
exports.BookServices = {
    createBookIntoDB,
    getAllBooksFromDB,
    getBookByIdFromDB,
    updateBookInDB,
    deleteBookFromDB,
    updatePublishedStatus
};
//# sourceMappingURL=book.service.js.map