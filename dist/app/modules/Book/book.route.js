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
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'bookCover', maxCount: 1 }
]), textToJsonParser_1.default, book_controller_1.BookControllers.createBook);
router.get("/", book_controller_1.BookControllers.getAllBooks);
router.get("/:id", book_controller_1.BookControllers.getBookById);
router.patch("/:id", textToJsonParser_1.default, book_controller_1.BookControllers.updateBook);
router.delete("/:id", book_controller_1.BookControllers.deleteBook);
router.patch("/:id/published-status", textToJsonParser_1.default, book_controller_1.BookControllers.updatePublishedStatus);
exports.BookRoutes = router;
//# sourceMappingURL=book.route.js.map