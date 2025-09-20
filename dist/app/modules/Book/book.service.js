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
        .search(["bookName", "authorName", "category", "brand"])
        .filter(["category"])
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
// 📌 Most Popular Books Service
const getMostPopularBooksFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.book, query);
    const books = await queryBuilder
        .range()
        .search(["bookName", "authorName", "category", "brand", "language"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: { isPublished: true },
        orderBy: { rating: "desc" }, // ⭐ highest rating আগে আসবে
    });
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError_1.default(404, "No popular books found");
    }
    return { meta, data: books };
};
// 📌 New Books Service
const getNewBooksFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.book, query);
    const books = await queryBuilder
        .range()
        .search(["bookName", "authorName", "category", "brand", "language"])
        .filter(["category", "language", "brand"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: { isPublished: true },
        orderBy: { publishDate: "desc" }, // ⭐ সর্বশেষ বই আগে আসবে
    });
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError_1.default(404, "No new books found");
    }
    return { meta, data: books };
};
const getPublishedBooksFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.book, query);
    const books = await queryBuilder
        .range()
        .search(["bookName", "authorName", "category", "brand"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            isPublished: true
        }
    });
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError_1.default(404, "No books found");
    }
    return { meta, data: books };
};
const getBookByIdFromDB = async (id) => {
    const existbook = await prisma_1.default.book.findUnique({ where: { id } });
    if (!existbook) {
        throw new ApiError_1.default(404, "Book not found!");
    }
    const result = await prisma_1.default.book.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
};
const updateBookInDB = async (id, payload, book, bookCover) => {
    // যদি payload undefined বা empty object হয়
    if (!payload || Object.keys(payload).length === 0) {
        throw new ApiError_1.default(400, "No data provided to update");
    }
    const existbook = await prisma_1.default.book.findUnique({ where: { id } });
    if (!existbook) {
        throw new ApiError_1.default(404, "Book not found!");
    }
    // file update handle
    if (book) {
        const uploadBook = await fileUploader_1.fileUploader.uploadToCloudinary(book);
        payload = { ...payload, book: uploadBook?.secure_url ?? existbook.book };
    }
    if (bookCover) {
        const uploadBookCover = await fileUploader_1.fileUploader.uploadToCloudinary(bookCover);
        payload = { ...payload, bookCover: uploadBookCover?.secure_url ?? existbook.bookCover };
    }
    // rating validation
    if (payload.rating !== undefined) {
        if (payload.rating < 1 || payload.rating > 5) {
            throw new ApiError_1.default(400, "Rating must be between 1 and 5");
        }
    }
    const result = await prisma_1.default.book.update({ where: { id }, data: payload });
    return result;
};
const deleteBookFromDB = async (id) => {
    return await prisma_1.default.$transaction(async (tx) => {
        // 1️⃣ বইটা আছে কিনা চেক করো
        const book = await tx.book.findUnique({
            where: { id },
            include: { orderItems: true },
        });
        if (!book) {
            throw new ApiError_1.default(404, "Book not found!");
        }
        // 2️⃣ আগে orderItems ডিলিট করো (যদি থাকে)
        if (book.orderItems.length > 0) {
            await tx.orderBookItem.deleteMany({
                where: { bookId: id },
            });
        }
        // 3️⃣ এবার বই ডিলিট করো
        await tx.book.delete({
            where: { id },
        });
        return { message: "Book and associated order items deleted successfully" };
    });
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
const getRelatedBooksFromDB = async (bookId, query) => {
    const currentBook = await prisma_1.default.book.findUnique({
        where: { id: bookId },
    });
    if (!currentBook) {
        throw new ApiError_1.default(404, "Book not found");
    }
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.book, query);
    const books = await queryBuilder
        .range()
        .search(["bookName", "authorName", "category", "brand"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            category: currentBook.category,
            id: { not: bookId },
            isPublished: true,
        },
    });
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError_1.default(404, "No related books found");
    }
    return { meta, data: books };
};
const ratingToBook = async (bookId, rating) => {
    // 1️⃣ rating validate করা
    if (rating < 1 || rating > 5) {
        throw new ApiError_1.default(400, "Rating must be between 1 and 5");
    }
    // 2️⃣ বই খুঁজে বের করা
    const book = await prisma_1.default.book.findUnique({
        where: {
            id: bookId
        }
    });
    if (!book) {
        throw new ApiError_1.default(404, "Book not found!");
    }
    // 3️⃣ rating update করা
    const result = await prisma_1.default.book.update({
        where: { id: bookId },
        data: { rating }
    });
    return result;
};
exports.BookServices = {
    createBookIntoDB,
    getAllBooksFromDB,
    getPublishedBooksFromDB,
    getBookByIdFromDB,
    updateBookInDB,
    deleteBookFromDB,
    updatePublishedStatus,
    getRelatedBooksFromDB,
    ratingToBook,
    getMostPopularBooksFromDB,
    getNewBooksFromDB
};
//# sourceMappingURL=book.service.js.map