import { Router, text } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { PodcastControllers } from "./podcast.controller";

const router = Router();

router.post("/create", fileUploader.upload.array("podcastFiles", 5), textToJSONParser,PodcastControllers.createPodcast);

export const PodcastRoutes = router;