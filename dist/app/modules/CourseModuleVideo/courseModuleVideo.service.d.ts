import { CourseModuleVideo } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
export declare const CourseModuleVideoServices: {
    createCourseModuleVideoIntoDB: (payload: CourseModuleVideo[], files?: Record<string, IFile>) => Promise<{
        id: string;
        courseId: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }[]>;
    getAllCourseModuleVideosFromDB: () => Promise<{
        id: string;
        courseId: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }[]>;
    getCourseModuleVideoByIdFromDB: (id: string) => Promise<{
        id: string;
        courseId: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    } | null>;
    updateCourseModuleVideoInDB: (id: string, payload: CourseModuleVideo, files?: Record<string, IFile>) => Promise<{
        id: string;
        courseId: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }>;
    deleteCourseModuleVideoFromDB: (id: string) => Promise<{
        id: string;
        courseId: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }>;
};
//# sourceMappingURL=courseModuleVideo.service.d.ts.map