"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const createPodcastIntoDB = async (payload, podcastFiles) => {
    if (podcastFiles && podcastFiles.length > 0) {
        const uploadPodcastImages = await fileUploader_1.fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
        payload.featureMedia = uploadPodcastImages.map(img => img.secure_url) ?? [];
    }
    const result = await prisma_1.default.podcast.create({
        data: payload
    });
    return result;
};
const getAllPodcastFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.podcast, query);
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
    return { meta, data: podcasts };
};
const updatePodcast = async (id, payload) => {
    const updatedPodcast = await prisma_1.default.podcast.update({
        where: { id },
        data: payload
    });
    return updatedPodcast;
};
const deletePodcast = async (id) => {
    const deletedPodcast = await prisma_1.default.podcast.delete({
        where: { id }
    });
    return deletedPodcast;
};
const updatePodcastStatus = async (id, status) => {
    const updatedPodcast = await prisma_1.default.podcast.update({
        where: { id },
        data: { isPublished: status }
    });
    return updatedPodcast;
};
exports.PodcastServices = {
    createPodcastIntoDB,
    getAllPodcastFromDB,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus
};
//# sourceMappingURL=podcast.service.js.map