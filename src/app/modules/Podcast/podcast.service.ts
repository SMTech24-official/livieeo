import { Podcast, PodcastActivity } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status"

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
const logPodcastPlay = async (payload: PodcastActivity, user: JwtPayload, podcastId: string) => {
    const podcast = await prisma.podcast.findUnique({
        where: {
            id: podcastId
        }
    })
    if (!podcast) {
        throw new ApiError(httpStatus.NOT_FOUND, "Podcast not found !")
    }
    // payload.userId = user.id
    // payload.podcastId = podcastId
    const activity = await prisma.podcastActivity.create({
        data: {
            userId: user.id,
            podcastId
        }
    })
    return activity
}
const getActivities = async (query: { user?: JwtPayload; type: "PODCAST", page?: number; limit: number }) => {
    const page = Math.max(Number(query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100)
    const skip = (page - 1) * limit
    const where: any = {}
    if (query?.user?.id) where.userId = query?.user?.id
    if (query?.type) where.type = query.type
    const [data, total] = await prisma.$transaction([
        prisma.podcastActivity.findMany({
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
        prisma.podcastActivity.count({ where })
    ])
    return { meta: { page, limit, total, pages: Math.ceil(total / limit) }, data }
}
const getMyRecentPodcasts = async (
  user: JwtPayload,
  opts?: { page?: number; limit?: number }
) => {
  const page = Math.max(Number(opts?.page) || 1, 1);
  const limit = Math.min(Math.max(Number(opts?.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  // 1) aggregate activities -> group by podcastId (only PODCAST)
  const raw = await prisma.podcastActivity.aggregateRaw({
    pipeline: [
      {
        $match: {
          userId: { $oid: user.id }, // ✅ Mongo ObjectId হিসেবে পাঠাতে হবে
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

  // 2) hydrate podcasts
  const groups =
    (raw as unknown as { _id: { $oid: string }; lastPlayedAt: string; plays: number }[]) || [];

  const ids = groups.map((g) => String(g._id.$oid)); // ✅ ObjectId → string

  const podcasts = await prisma.podcast.findMany({
    where: { id: { in: ids } },
  });

  // 3) merge
  const map = new Map(podcasts.map((p) => [p.id, p]));
  const rows = groups.map((g) => ({
    podcast: map.get(String(g._id.$oid)) || null,
    lastPlayedAt: new Date(g.lastPlayedAt),
    plays: g.plays,
  }));

  // 4) total distinct podcasts for this user
  const totalAgg = await prisma.podcastActivity.aggregateRaw({
    pipeline: [
      {
        $match: {
          userId: { $oid: user.id }, // ✅ একইভাবে পাঠাতে হবে
          type: "PODCAST",
          podcastId: { $ne: null },
        },
      },
      { $group: { _id: "$podcastId" } },
      { $count: "total" },
    ],
  });

  const total = (totalAgg as unknown as any[])[0]?.total ?? 0;

  return {
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
    data: rows,
  };
};
export const PodcastServices = {
    createPodcastIntoDB,
    getAllPodcastFromDB,
    getPublishedPodcastFromDB,
    updatePodcast,
    deletePodcast,
    updatePodcastStatus,
    logPodcastPlay,
    getActivities,
    getMyRecentPodcasts
};