import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { BookSpeakerControllers } from "./bookSpeaker.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/create-book-speaker",auth(UserRole.ADMIN), fileUploader.upload.single("file"),textToJSONParser,BookSpeakerControllers.createBookSpeaker)
router.get("/", BookSpeakerControllers.getAllBookSpeaker)
router.get("/:speakerId", BookSpeakerControllers.getBookSpeakerById)
router.put("/:speakerId", BookSpeakerControllers.updateBookSpeaker)
router.delete("/:speakerId", BookSpeakerControllers.deleteBookSpeaker)

export const BookSpeakerRoutes = router