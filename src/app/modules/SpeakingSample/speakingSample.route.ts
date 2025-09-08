import { Router } from "express";
import { SpeakingSampleControllers } from "./speakingSample.controllers";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";

const router = Router()

router.post("/create", fileUploader.upload.single("video"), textToJSONParser, SpeakingSampleControllers.createSpeakingSample)
router.get("/:speakingSampleId", SpeakingSampleControllers.getSpeakingSampleById)
router.get("/:speakingSampleId", SpeakingSampleControllers.updateSpeakingSample)
router.get("/:speakingSampleId", SpeakingSampleControllers.deleteSpeakingSample)
router.get("/", SpeakingSampleControllers.getAllSpeakingSample)
router.get("/:speakingSampleId/related-speaking-sample", SpeakingSampleControllers.getRelatedSpeakingSample)

export const SpeakingSampleRoutes = router