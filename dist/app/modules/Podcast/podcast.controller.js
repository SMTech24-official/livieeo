"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const podcast_service_1 = require("./podcast.service");
const createPodcast = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const podcastFiles = req.files;
    const result = await podcast_service_1.PodcastServices.createPodcastIntoDB(payload, podcastFiles);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Podcast created successfully",
        data: result
    });
});
const getAllPodcasts = (0, catchAsync_1.default)(async (req, res) => {
    const podcasts = await podcast_service_1.PodcastServices.getAllPodcastFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcasts retrieved successfully",
        data: podcasts
    });
});
const updatePodcast = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const updatedPodcast = await podcast_service_1.PodcastServices.updatePodcast(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast updated successfully",
        data: updatedPodcast
    });
});
const deletePodcast = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const deletedPodcast = await podcast_service_1.PodcastServices.deletePodcast(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast deleted successfully",
        data: deletedPodcast
    });
});
const updatePodcastStatus = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const updatedPodcast = await podcast_service_1.PodcastServices.updatePodcastStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast status updated successfully",
        data: updatedPodcast
    });
});
exports.PodcastControllers = {
    createPodcast,
    getAllPodcasts,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus
};
//# sourceMappingURL=podcast.controller.js.map