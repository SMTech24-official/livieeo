import { Router, text } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { PodcastControllers } from "./podcast.controller";

const router = Router();

router.post("/create", fileUploader.upload.array("podcastFiles", 5), textToJSONParser,PodcastControllers.createPodcast);
router.get("/", PodcastControllers.getAllPodcasts);
router.patch("/:id", PodcastControllers.updatePodcast);
router.delete("/:id", PodcastControllers.deletePodcast);
router.patch("/podcast-status/:id", PodcastControllers.updatePodcastStatus);

export const PodcastRoutes = router;