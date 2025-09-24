import { Router } from "express";
import { SpeakingSampleControllers } from "./speakingSample.controllers";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("video"),
  textToJSONParser,
  SpeakingSampleControllers.createSpeakingSample
);
router.get(
  "/:speakingSampleId",
  SpeakingSampleControllers.getSpeakingSampleById
);
router.patch(
  "/:speakingSampleId",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("video"),
  SpeakingSampleControllers.updateSpeakingSample
);
router.delete(
  "/:speakingSampleId",
  auth(UserRole.ADMIN),
  SpeakingSampleControllers.deleteSpeakingSample
);
router.get("/", SpeakingSampleControllers.getAllSpeakingSample);
router.get(
  "/:speakingSampleId/related-speaking-sample",
  SpeakingSampleControllers.getRelatedSpeakingSample
);

export const SpeakingSampleRoutes = router;
