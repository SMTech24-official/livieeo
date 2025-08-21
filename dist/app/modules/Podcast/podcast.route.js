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
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.array("podcastFiles", 5), textToJsonParser_1.default, podcast_controller_1.PodcastControllers.createPodcast);
router.get("/", podcast_controller_1.PodcastControllers.getAllPodcasts);
router.patch("/:id", podcast_controller_1.PodcastControllers.updatePodcast);
router.delete("/:id", podcast_controller_1.PodcastControllers.deletePodcast);
router.patch("/podcast-status/:id", podcast_controller_1.PodcastControllers.updatePodcastStatus);
exports.PodcastRoutes = router;
//# sourceMappingURL=podcast.route.js.map