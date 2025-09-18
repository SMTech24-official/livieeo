import { Router, text } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { PodcastControllers } from "./podcast.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// router.post("/create", fileUploader.upload.array("podcastFiles", 5), textToJSONParser,PodcastControllers.createPodcast);

// podcast.route.ts
router.post(
  "/create",
  fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 1 },
    { name: "podcastFiles", maxCount: 5 },
  ]),
  auth(UserRole.ADMIN),
  textToJSONParser,
  PodcastControllers.createPodcast
);

router.get("/",auth(UserRole.ADMIN), PodcastControllers.getAllPodcasts);
router.get("/published-podcast",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.getPublishedPodcasts);

router.patch(
  "/:id",
  fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 1 },
    { name: "podcastFiles", maxCount: 5 },
  ]),
  auth(UserRole.ADMIN),
  textToJSONParser,
  PodcastControllers.updatePodcast
);

router.delete("/:id",auth(UserRole.ADMIN), PodcastControllers.deletePodcast);
router.patch("/podcast-status/:id",auth(UserRole.ADMIN), PodcastControllers.updatePodcastStatus);

router.post("/log-play/:podcastId",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.logPodcastPlay);
router.get("/activities",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.getActivities);
router.get("/my-recent-podcasts",auth(UserRole.ADMIN,UserRole.USER), PodcastControllers.getMyRecentPodcasts);
router.get("/:podcastId/related-podcasts",auth(UserRole.ADMIN,UserRole.USER),PodcastControllers.getRelatedPodcasts)
router.get("/:podcastId",auth(UserRole.ADMIN,UserRole.USER),PodcastControllers.getSinglePodcast)

export const PodcastRoutes = router;