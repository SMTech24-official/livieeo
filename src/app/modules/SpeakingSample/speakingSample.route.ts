import { Router } from "express";
import { SpeakingSampleControllers } from "./speakingSample.controllers";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";

const router = Router()

router.post("/create", fileUploader.upload.single("video"), textToJSONParser, SpeakingSampleControllers.createSpeakingSample)

export const SpeakingSampleRoutes = router