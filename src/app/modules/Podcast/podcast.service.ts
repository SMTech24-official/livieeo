import { Podcast } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createPodcastIntoDB = async(payload: Podcast, podcastFiles: IFile[]) => {
    if (podcastFiles && podcastFiles.length > 0) {
        const uploadPodcastImages = await fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
        payload.featureMedia = uploadPodcastImages.map(img => img.secure_url) ?? [];
    }
    const result = await prisma.podcast.create({
        data: payload
    });
    return result;
}

export const PodcastServices = {
    createPodcastIntoDB
};