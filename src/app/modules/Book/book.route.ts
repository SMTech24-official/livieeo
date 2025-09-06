import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { BookControllers } from "./book.controller";

const router = Router();

router.post("/create", fileUploader.upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'bookCover', maxCount: 1 }
]), textToJSONParser, BookControllers.createBook);
router.get("/", BookControllers.getAllBooks);
router.get("/most-popular", BookControllers.getMostPopularBooks);
router.get("/new-books", BookControllers.getNewBooks);
router.get("/published-books", BookControllers.getPublishedBooks);
router.get("/:id", BookControllers.getBookById);
router.patch("/:id",fileUploader.upload.fields([
    { name: 'book', maxCount: 1 },
    { name: 'bookCover', maxCount: 1 }
]), textToJSONParser, BookControllers.updateBook);
router.delete("/:id", BookControllers.deleteBook);
router.patch("/:id/published-status", textToJSONParser, BookControllers.updatePublishedStatus);
router.patch("/rating/:bookId", BookControllers.ratingToBook)
router.get("/:bookId/related-books", BookControllers.getRelatedBooks)

export const BookRoutes = router;