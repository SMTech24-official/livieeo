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
router.get("/:id", BookControllers.getBookById);
router.patch("/:id", textToJSONParser, BookControllers.updateBook);
router.delete("/:id", BookControllers.deleteBook);

export const BookRoutes = router;