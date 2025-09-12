"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const book_controller_1 = require("./book.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'bookCover', maxCount: 1 }
]), (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, book_controller_1.BookControllers.createBook);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), book_controller_1.BookControllers.getAllBooks);
router.get("/most-popular", book_controller_1.BookControllers.getMostPopularBooks);
router.get("/new-books", book_controller_1.BookControllers.getNewBooks);
router.get("/published-books", book_controller_1.BookControllers.getPublishedBooks);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), book_controller_1.BookControllers.getBookById);
router.patch("/:id", fileUploader_1.fileUploader.upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'bookCover', maxCount: 1 }
]), (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, book_controller_1.BookControllers.updateBook);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), book_controller_1.BookControllers.deleteBook);
router.patch("/:id/published-status", (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, book_controller_1.BookControllers.updatePublishedStatus);
router.patch("/rating/:bookId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), book_controller_1.BookControllers.ratingToBook);
router.get("/:bookId/related-books", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), book_controller_1.BookControllers.getRelatedBooks);
exports.BookRoutes = router;
//# sourceMappingURL=book.route.js.map