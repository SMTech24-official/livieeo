"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// const createPodcastIntoDB = async (payload: Podcast, podcastFiles: IFile[]) => {
//   if (podcastFiles && podcastFiles.length > 0) {
//     const uploadPodcastImages = await fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
//     payload.featureMedia = uploadPodcastImages.map(img => img.secure_url) ?? [];
//   }
//   const result = await prisma.podcast.create({
//     data: payload
//   });
//   return result;
// }
// podcast.service.ts
const createPodcastIntoDB = async (payload, thumbImageFile, podcastFiles = []) => {
    // 1) Upload thumb image
    if (thumbImageFile) {
        const uploadedThumb = await fileUploader_1.fileUploader.uploadToCloudinary(thumbImageFile);
        payload.thumbImage = uploadedThumb?.secure_url ?? null;
    }
    // 2) Upload podcast files
    if (podcastFiles.length > 0) {
        const uploadedFiles = await fileUploader_1.fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
        payload.featureMedia = uploadedFiles.map(file => file.secure_url);
    }
    else {
        payload.featureMedia = [];
    }
    // 3) Save to DB
    const result = await prisma_1.default.podcast.create({ data: payload });
    return result;
};
const getAllPodcastFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.podcast, query);
    const podcasts = await queryBuilder.range()
        .search(["category", "podcastTitle", "secondaryTitle"])
        .filter(["category"])
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
const getSinglePodcastFromDB = async (podcastId) => {
    const podcast = await prisma_1.default.podcast.findUnique({
        where: { id: podcastId }
    });
    if (!podcast) {
        throw new ApiError_1.default(404, "Podcast not found");
    }
    return podcast;
};
const getPublishedPodcastFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.podcast, query);
    const podcasts = await queryBuilder.range()
        .search(["category", "podcastTitle", "secondaryTitle"])
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
    return { meta, data: podcasts };
};
const getRelatedPodcastsFromDB = async (podcastId, query) => {
    // 1) current podcast বের করা
    const currentPodcast = await prisma_1.default.podcast.findUnique({
        where: { id: podcastId },
    });
    if (!currentPodcast) {
        throw new ApiError_1.default(404, "Podcast not found");
    }
    // 2) QueryBuilder দিয়ে related আনবো
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.podcast, query);
    const podcasts = await queryBuilder
        .range()
        .search(["podcastTitle", "secondaryTitle"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            id: { not: podcastId }, // নিজের podcast বাদ
            category: {
                contains: currentPodcast.category,
                mode: "insensitive", // ✅ Case-insensitive match
            },
            isPublished: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    const meta = await queryBuilder.countTotal();
    if (!podcasts || podcasts.length === 0) {
        throw new ApiError_1.default(404, "No related podcasts found");
    }
    return { meta, data: podcasts };
};
const updatePodcast = async (id, payload, podcastFiles) => {
    if (podcastFiles && podcastFiles.length > 0) {
        const uploadPodcastImages = await fileUploader_1.fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
        payload.featureMedia = uploadPodcastImages.map(img => img.secure_url) ?? [];
    }
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
const updatePodcastStatus = async (id) => {
    const updatedPodcast = await prisma_1.default.podcast.update({
        where: { id },
        data: { isPublished: true, publishDate: new Date() }
    });
    return updatedPodcast;
};
const logPodcastPlay = async (payload, user, podcastId) => {
    const podcast = await prisma_1.default.podcast.findUnique({
        where: {
            id: podcastId
        }
    });
    if (!podcast) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Podcast not found !");
    }
    // payload.userId = user.id
    // payload.podcastId = podcastId
    const activity = await prisma_1.default.podcastActivity.create({
        data: {
            userId: user.id,
            podcastId
        }
    });
    return activity;
};
const getActivities = async (query) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const where = {};
    if (query?.user?.id)
        where.userId = query?.user?.id;
    if (query?.type)
        where.type = query.type;
    const [data, total] = await prisma_1.default.$transaction([
        prisma_1.default.podcastActivity.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                podcast: true
            }
        }),
        prisma_1.default.podcastActivity.count({ where })
    ]);
    return { meta: { page, limit, total, pages: Math.ceil(total / limit) }, data };
};
// final
const getMyRecentPodcasts = async (user, opts) => {
    const page = Math.max(Number(opts?.page) || 1, 1);
    const limit = Math.min(Math.max(Number(opts?.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    // মূল pipeline
    const raw = await prisma_1.default.podcastActivity.aggregateRaw({
        pipeline: [
            {
                $match: {
                    userId: { $oid: user.id }, // যদি DB-তে ObjectId থাকে
                    type: "PODCAST",
                    podcastId: { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$podcastId",
                    lastPlayedAt: { $max: "$createdAt" },
                    plays: { $sum: 1 },
                },
            },
            { $sort: { lastPlayedAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ],
    });
    const groups = raw;
    if (!groups.length) {
        return {
            meta: { page, limit, total: 0, pages: 0 },
            data: [],
        };
    }
    // podcast ids বের করা
    const ids = groups.map((g) => typeof g._id === "object" && g._id.$oid
        ? g._id.$oid
        : String(g._id));
    const podcasts = await prisma_1.default.podcast.findMany({
        where: { id: { in: ids } },
    });
    const map = new Map(podcasts.map((p) => [p.id, p]));
    // unwrap $date properly
    const rows = groups.map((g) => {
        let lastPlayed = null;
        if (g.lastPlayedAt) {
            if (typeof g.lastPlayedAt === "object" && g.lastPlayedAt.$date) {
                lastPlayed = new Date(g.lastPlayedAt.$date);
            }
            else if (typeof g.lastPlayedAt === "string") {
                lastPlayed = new Date(g.lastPlayedAt);
            }
        }
        return {
            podcast: map.get(typeof g._id === "object" && g._id.$oid
                ? g._id.$oid
                : String(g._id)) || null,
            lastPlayedAt: lastPlayed,
            plays: g.plays,
        };
    });
    // total বের করা
    const totalAgg = await prisma_1.default.podcastActivity.aggregateRaw({
        pipeline: [
            {
                $match: {
                    userId: { $oid: user.id },
                    type: "PODCAST",
                    podcastId: { $ne: null },
                },
            },
            { $group: { _id: "$podcastId" } },
            { $count: "total" },
        ],
    });
    const total = totalAgg[0]?.total ?? 0;
    return {
        meta: { page, limit, total, pages: Math.ceil(total / limit) },
        data: rows,
    };
};
exports.PodcastServices = {
    createPodcastIntoDB,
    getAllPodcastFromDB,
    getPublishedPodcastFromDB,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus,
    logPodcastPlay,
    getActivities,
    getMyRecentPodcasts,
    getRelatedPodcastsFromDB,
    getSinglePodcastFromDB
};
//# sourceMappingURL=podcast.service.js.map