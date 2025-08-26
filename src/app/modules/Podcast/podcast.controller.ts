import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PodcastServices } from "./podcast.service";

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

    const updatedPodcast = await PodcastServices.updatePodcast(id, payload);

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
    const status = req.body.status as boolean;

    const updatedPodcast = await PodcastServices.updatePodcastStatus(id, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Podcast status updated successfully",
        data: updatedPodcast
    })
})
export const PodcastControllers = {
    createPodcast,
    getAllPodcasts,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus,
    getPublishedPodcasts
};