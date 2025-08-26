import { Podcast } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";

const createPodcastIntoDB = async (payload: Podcast, podcastFiles: IFile[]) => {
    if (podcastFiles && podcastFiles.length > 0) {
        const uploadPodcastImages = await fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
        payload.featureMedia = uploadPodcastImages.map(img => img.secure_url) ?? [];
    }
    const result = await prisma.podcast.create({
        data: payload
    });
    return result;
}

const getAllPodcastFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Podcast[]>> => {
    const queryBuilder = new QueryBuilder(prisma.podcast, query)
    const podcasts = await queryBuilder.range()
        .search(["podcastTitle", "secondaryTitle"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            orderBy: {
                createdAt: 'desc'
            }
        });
    const meta = await queryBuilder.countTotal();
    return { meta, data: podcasts }
}
const getPublishedPodcastFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Podcast[]>> => {
    const queryBuilder = new QueryBuilder(prisma.podcast, query)
    const podcasts = await queryBuilder.range()
        .search(["podcastTitle", "secondaryTitle"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            where: {
                isPublished: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    const meta = await queryBuilder.countTotal();
    return { meta, data: podcasts }
}


const updatePodcast = async (id: string, payload: Partial<Podcast>) => {
    const updatedPodcast = await prisma.podcast.update({
        where: { id },
        data: payload
    });
    return updatedPodcast;
}
const deletePodcast = async (id: string) => {
    const deletedPodcast = await prisma.podcast.delete({
        where: { id }
    });
    return deletedPodcast;
}
const updatePodcastStatus = async (id: string, status: boolean) => {
    const updatedPodcast = await prisma.podcast.update({
        where: { id },
        data: { isPublished: status }
    });
    return updatedPodcast;
}

export const PodcastServices = {
    createPodcastIntoDB,
    getAllPodcastFromDB,
    getPublishedPodcastFromDB,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus
};