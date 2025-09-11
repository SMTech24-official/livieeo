import { Podcast, PodcastActivity } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status"

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
const createPodcastIntoDB = async (
  payload: Podcast,
  thumbImageFile?: IFile,
  podcastFiles: IFile[] = []
) => {
  // 1) Upload thumb image
  if (thumbImageFile) {
    const uploadedThumb = await fileUploader.uploadToCloudinary(thumbImageFile);
    payload.thumbImage = uploadedThumb?.secure_url ?? null;
  }

  // 2) Upload podcast files
  if (podcastFiles.length > 0) {
    const uploadedFiles = await fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
    payload.featureMedia = uploadedFiles.map(file => file.secure_url);
  } else {
    payload.featureMedia = [];
  }

  // 3) Save to DB
  const result = await prisma.podcast.create({ data: payload });
  return result;
};

const getAllPodcastFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Podcast[]>> => {
  const queryBuilder = new QueryBuilder(prisma.podcast, query)
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
  return { meta, data: podcasts }
}
const getSinglePodcastFromDB = async (podcastId: string) => {
  const podcast = await prisma.podcast.findUnique({
    where: { id: podcastId }
  });

  if (!podcast) {
    throw new ApiError(404, "Podcast not found");
  }

  return podcast;
};
const getPublishedPodcastFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Podcast[]>> => {
  const queryBuilder = new QueryBuilder(prisma.podcast, query)
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
  return { meta, data: podcasts }
}
const getRelatedPodcastsFromDB = async (
  podcastId: string,
  query: Record<string, unknown>
): Promise<IGenericResponse<Podcast[]>> => {
  // 1) current podcast বের করা
  const currentPodcast = await prisma.podcast.findUnique({
    where: { id: podcastId },
  });

  if (!currentPodcast) {
    throw new ApiError(404, "Podcast not found");
  }

  // 2) QueryBuilder দিয়ে related আনবো
  const queryBuilder = new QueryBuilder(prisma.podcast, query);

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
    throw new ApiError(404, "No related podcasts found");
  }

  return { meta, data: podcasts };
};

const updatePodcast = async (id: string, payload: Partial<Podcast>, podcastFiles?: IFile[]) => {
  if (podcastFiles && podcastFiles.length > 0) {
    const uploadPodcastImages = await fileUploader.uploadMultipleVideoToCloudinary(podcastFiles);
    payload.featureMedia = uploadPodcastImages.map(img => img.secure_url) ?? [];
  }
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
const updatePodcastStatus = async (id: string) => {
  const updatedPodcast = await prisma.podcast.update({
    where: { id },
    data: { isPublished: true, publishDate: new Date() }
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


// final
const getMyRecentPodcasts = async (
  user: JwtPayload,
  opts?: { page?: number; limit?: number }
) => {
  const page = Math.max(Number(opts?.page) || 1, 1);
  const limit = Math.min(Math.max(Number(opts?.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  // মূল pipeline
  const raw = await prisma.podcastActivity.aggregateRaw({
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

  const groups = raw as unknown as {
    _id: { $oid: string } | string;
    lastPlayedAt?: { $date: string } | string;
    plays: number;
  }[];

  if (!groups.length) {
    return {
      meta: { page, limit, total: 0, pages: 0 },
      data: [],
    };
  }

  // podcast ids বের করা
  const ids = groups.map((g) =>
    typeof g._id === "object" && (g._id as any).$oid
      ? (g._id as any).$oid
      : String(g._id)
  );

  const podcasts = await prisma.podcast.findMany({
    where: { id: { in: ids } },
  });

  const map = new Map(podcasts.map((p) => [p.id, p]));

  // unwrap $date properly
  const rows = groups.map((g) => {
    let lastPlayed: Date | null = null;

    if (g.lastPlayedAt) {
      if (typeof g.lastPlayedAt === "object" && (g.lastPlayedAt as any).$date) {
        lastPlayed = new Date((g.lastPlayedAt as any).$date);
      } else if (typeof g.lastPlayedAt === "string") {
        lastPlayed = new Date(g.lastPlayedAt);
      }
    }

    return {
      podcast:
        map.get(
          typeof g._id === "object" && (g._id as any).$oid
            ? (g._id as any).$oid
            : String(g._id)
        ) || null,
      lastPlayedAt: lastPlayed,
      plays: g.plays,
    };
  });

  // total বের করা
  const totalAgg = await prisma.podcastActivity.aggregateRaw({
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
  getMyRecentPodcasts,
  getRelatedPodcastsFromDB,
  getSinglePodcastFromDB
};