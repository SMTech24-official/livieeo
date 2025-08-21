import { Podcast } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { IGenericResponse } from "../../../interfaces/common";
export declare const PodcastServices: {
    createPodcastIntoDB: (payload: Podcast, podcastFiles: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    getAllPodcastFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Podcast[]>>;
    updatePodcast: (id: string, payload: Partial<Podcast>) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    deletePodcast: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
    updatePodcastStatus: (id: string, status: boolean) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        featureMedia: string[];
        podcastTitle: string;
        secondaryTitle: string;
        constent: string;
    }>;
};
//# sourceMappingURL=podcast.service.d.ts.map