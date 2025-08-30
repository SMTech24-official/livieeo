import { JwtPayload } from "jsonwebtoken";
import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PodcastServices } from "./podcast.service";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status"

const createPodcast = catchAsync(async (req, res) => {
    const payload = req.body;
    const podcastFiles = req.files as IFile[];

    const result = await PodcastServices.createPodcastIntoDB(payload, podcastFiles);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Podcast created successfully",
        data: result
    })
})
const getAllPodcasts = catchAsync(async (req, res) => {
    const podcasts = await PodcastServices.getAllPodcastFromDB(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcasts retrieved successfully",
        data: podcasts
    })
})
const getPublishedPodcasts = catchAsync(async (req, res) => {
    const podcasts = await PodcastServices.getAllPodcastFromDB(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Published podcasts retrieved successfully",
        data: podcasts
    })
})
const updatePodcast = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const payload = req.body;
    const podcastFiles = req.files as IFile[];
    const updatedPodcast = await PodcastServices.updatePodcast(id, payload,podcastFiles);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcast updated successfully",
        data: updatedPodcast
    })
})

const deletePodcast = catchAsync(async (req, res) => {
    const id = req.params.id as string;

    const deletedPodcast = await PodcastServices.deletePodcast(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcast deleted successfully",
        data: deletedPodcast
    })
})
const updatePodcastStatus = catchAsync(async (req, res) => {
    const id = req.params.id as string;

    const updatedPodcast = await PodcastServices.updatePodcastStatus(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcast status updated successfully",
        data: updatedPodcast
    })
})
const logPodcastPlay = catchAsync(async (req, res) => {
    const {podcastId} = req.params
    const payload = req.body;
    const user = req.user

    const result = await PodcastServices.logPodcastPlay(payload, user as JwtPayload, podcastId as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcast play logged successfully",
        data: result
    })
})
const getActivities = catchAsync(async (req, res) => {
    const activities = await PodcastServices.getActivities({
    user: (req.query.user as JwtPayload) || undefined,
    type: "PODCAST",
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcast activities retrieved successfully",
        meta: activities.meta,
        data: activities
    })
})
const getMyRecentPodcasts = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;

  if (!user?.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not logged in");
  }

  const activities = await PodcastServices.getMyRecentPodcasts(user, {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My recent podcasts retrieved successfully",
    meta: activities.meta,
    data: activities.data,
  });
});
export const PodcastControllers = {
    createPodcast,
    getAllPodcasts,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus,
    getPublishedPodcasts,
    logPodcastPlay,
    getActivities,
    getMyRecentPodcasts
};