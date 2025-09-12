import { Podcast, PodcastActivity } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { IGenericResponse } from "../../../interfaces/common";
import { JwtPayload } from "jsonwebtoken";
export declare const PodcastServices: {
    createPodcastIntoDB: (payload: Podcast, thumbImageFile?: IFile, podcastFiles?: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        thumbImage: string | null;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    getAllPodcastFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Podcast[]>>;
    getPublishedPodcastFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Podcast[]>>;
    updatePodcast: (id: string, payload: Partial<Podcast>, podcastFiles?: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        thumbImage: string | null;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    deletePodcast: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        thumbImage: string | null;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    updatePodcastStatus: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        thumbImage: string | null;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    logPodcastPlay: (payload: PodcastActivity, user: JwtPayload, podcastId: string) => Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        type: string;
        action: import("@prisma/client").$Enums.ActivityAction;
        podcastId: string;
    }>;
    getActivities: (query: {
        user?: JwtPayload;
        type: "PODCAST";
        page?: number;
        limit: number;
    }) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        data: ({
            podcast: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                isPublished: boolean;
                publishDate: Date;
                thumbImage: string | null;
                featureMedia: string[];
                podcastTitle: string;
                secondaryTitle: string;
                constent: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            type: string;
            action: import("@prisma/client").$Enums.ActivityAction;
            podcastId: string;
        })[];
    }>;
    getMyRecentPodcasts: (user: JwtPayload, opts?: {
        page?: number;
        limit?: number;
    }) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
        data: {
            podcast: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                category: string;
                isPublished: boolean;
                publishDate: Date;
                thumbImage: string | null;
                featureMedia: string[];
                podcastTitle: string;
                secondaryTitle: string;
                constent: string;
            } | null;
            lastPlayedAt: Date | null;
            plays: number;
        }[];
    }>;
    getRelatedPodcastsFromDB: (podcastId: string, query: Record<string, unknown>) => Promise<IGenericResponse<Podcast[]>>;
    getSinglePodcastFromDB: (podcastId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        thumbImage: string | null;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
};
//# sourceMappingURL=podcast.service.d.ts.map