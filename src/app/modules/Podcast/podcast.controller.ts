import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import { PodcastServices } from "./podcast.service";

const createPodcast = catchAsync(async (req, res) => {
    const payload = req.body;
    const podcastFiles = req.files as IFile[];

    const result = await PodcastServices.createPodcastIntoDB(payload, podcastFiles);

    res.status(201).json({
        success: true,
        message: "Podcast created successfully",
        data: result
    });
})

export const PodcastControllers = {
    createPodcast
};