"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastRoutes = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const podcast_controller_1 = require("./podcast.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// router.post("/create", fileUploader.upload.array("podcastFiles", 5), textToJSONParser,PodcastControllers.createPodcast);
// podcast.route.ts
router.post("/create", fileUploader_1.fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 1 },
    { name: "podcastFiles", maxCount: 5 },
]), (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, podcast_controller_1.PodcastControllers.createPodcast);
router.get("/", podcast_controller_1.PodcastControllers.getAllPodcasts);
router.get("/published-podcast", podcast_controller_1.PodcastControllers.getPublishedPodcasts);
router.patch("/:id", fileUploader_1.fileUploader.upload.fields([
    { name: "thumbImage", maxCount: 1 },
    { name: "podcastFiles", maxCount: 5 },
]), (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, podcast_controller_1.PodcastControllers.updatePodcast);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), podcast_controller_1.PodcastControllers.deletePodcast);
router.patch("/podcast-status/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), podcast_controller_1.PodcastControllers.updatePodcastStatus);
router.post("/log-play/:podcastId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), podcast_controller_1.PodcastControllers.logPodcastPlay);
router.get("/activities", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), podcast_controller_1.PodcastControllers.getActivities);
router.get("/my-recent-podcasts", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), podcast_controller_1.PodcastControllers.getMyRecentPodcasts);
router.get("/:podcastId/related-podcasts", podcast_controller_1.PodcastControllers.getRelatedPodcasts);
router.get("/:podcastId", podcast_controller_1.PodcastControllers.getSinglePodcast);
exports.PodcastRoutes = router;
//# sourceMappingURL=podcast.route.js.map