import { Router } from "express";
import { SpeakingSampleControllers } from "./speakingSample.controllers";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/create",auth(UserRole.ADMIN), fileUploader.upload.single("video"), textToJSONParser, SpeakingSampleControllers.createSpeakingSample)
router.get("/:speakingSampleId",auth(UserRole.ADMIN,UserRole.USER), SpeakingSampleControllers.getSpeakingSampleById)
router.get("/:speakingSampleId",auth(UserRole.ADMIN), SpeakingSampleControllers.updateSpeakingSample)
router.get("/:speakingSampleId",auth(UserRole.ADMIN), SpeakingSampleControllers.deleteSpeakingSample)
router.get("/", SpeakingSampleControllers.getAllSpeakingSample)
router.get("/:speakingSampleId/related-speaking-sample",auth(UserRole.ADMIN,UserRole.USER), SpeakingSampleControllers.getRelatedSpeakingSample)

export const SpeakingSampleRoutes = router