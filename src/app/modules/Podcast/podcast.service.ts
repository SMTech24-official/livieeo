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

const getAllPodcasts = async() => {
    const podcasts = await prisma.podcast.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return podcasts;
}
const updatePodcast = async(id: string, payload: Partial<Podcast>) => {
    const updatedPodcast = await prisma.podcast.update({
        where: { id },
        data: payload
    });
    return updatedPodcast;
}
const deletePodcast = async(id: string) => {
    const deletedPodcast = await prisma.podcast.delete({
        where: { id }
    });
    return deletedPodcast;
}
const updatePodcastStatus = async(id: string, status: boolean) => {
    const updatedPodcast = await prisma.podcast.update({
        where: { id },
        data: { isPublished: status }
    });
    return updatedPodcast;
}

export const PodcastServices = {
    createPodcastIntoDB,
    getAllPodcasts,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus
};