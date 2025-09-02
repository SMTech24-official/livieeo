import { Router, text } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { PodcastControllers } from "./podcast.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/create", fileUploader.upload.array("podcastFiles", 5), textToJSONParser,PodcastControllers.createPodcast);
router.get("/", PodcastControllers.getAllPodcasts);
router.get("/published-podcast", PodcastControllers.getPublishedPodcasts);
router.patch("/:id", fileUploader.upload.array("podcastFiles", 5), textToJSONParser, PodcastControllers.updatePodcast);
router.delete("/:id", PodcastControllers.deletePodcast);
router.patch("/podcast-status/:id", PodcastControllers.updatePodcastStatus);

router.post("/log-play/:podcastId",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.logPodcastPlay);
router.get("/activities", PodcastControllers.getActivities);
router.get("/my-recent-podcasts",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.getMyRecentPodcasts);
router.get("/:podcastId/related-podcasts")

export const PodcastRoutes = router;