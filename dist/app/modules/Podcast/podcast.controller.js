"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const podcast_service_1 = require("./podcast.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
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
        meta: podcasts.meta,
        data: podcasts.data
    });
});
const getSinglePodcast = (0, catchAsync_1.default)(async (req, res) => {
    const { podcastId } = req.params;
    const podcasts = await podcast_service_1.PodcastServices.getSinglePodcastFromDB(podcastId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast retrieved successfully",
        data: podcasts
    });
});
const getPublishedPodcasts = (0, catchAsync_1.default)(async (req, res) => {
    const podcasts = await podcast_service_1.PodcastServices.getAllPodcastFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Published podcasts retrieved successfully",
        meta: podcasts.meta,
        data: podcasts.data
    });
});
const getRelatedPodcasts = (0, catchAsync_1.default)(async (req, res) => {
    const { podcastId } = req.params;
    const podcasts = await podcast_service_1.PodcastServices.getRelatedPodcastsFromDB(podcastId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Published podcasts retrieved successfully",
        meta: podcasts.meta,
        data: podcasts.data
    });
});
const updatePodcast = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const podcastFiles = req.files;
    const updatedPodcast = await podcast_service_1.PodcastServices.updatePodcast(id, payload, podcastFiles);
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
    const updatedPodcast = await podcast_service_1.PodcastServices.updatePodcastStatus(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast status updated successfully",
        data: updatedPodcast
    });
});
const logPodcastPlay = (0, catchAsync_1.default)(async (req, res) => {
    const { podcastId } = req.params;
    const payload = req.body;
    const user = req.user;
    const result = await podcast_service_1.PodcastServices.logPodcastPlay(payload, user, podcastId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast play logged successfully",
        data: result
    });
});
const getActivities = (0, catchAsync_1.default)(async (req, res) => {
    const activities = await podcast_service_1.PodcastServices.getActivities({
        user: req.query.user || undefined,
        type: "PODCAST",
        page: Number(req.query.page),
        limit: Number(req.query.limit),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Podcast activities retrieved successfully",
        meta: activities.meta,
        data: activities
    });
});
const getMyRecentPodcasts = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    if (!user?.id) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User not logged in");
    }
    const activities = await podcast_service_1.PodcastServices.getMyRecentPodcasts(user, {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My recent podcasts retrieved successfully",
        meta: activities.meta,
        data: activities.data,
    });
});
exports.PodcastControllers = {
    createPodcast,
    getAllPodcasts,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus,
    getPublishedPodcasts,
    logPodcastPlay,
    getActivities,
    getMyRecentPodcasts,
    getRelatedPodcasts,
    getSinglePodcast
};
//# sourceMappingURL=podcast.controller.js.map