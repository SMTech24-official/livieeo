import { CourseModuleVideo } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
export declare const CourseModuleVideoServices: {
    createCourseModuleVideoIntoDB: (payload: CourseModuleVideo, thumbImage?: IFile, video?: IFile) => Promise<{
        id: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }>;
    getAllCourseModuleVideosFromDB: () => Promise<{
        id: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }[]>;
    getCourseModuleVideoByIdFromDB: (id: string) => Promise<{
        id: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    } | null>;
    updateCourseModuleVideoInDB: (id: string, payload: CourseModuleVideo) => Promise<{
        id: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }>;
    deleteCourseModuleVideoFromDB: (id: string) => Promise<{
        id: string;
        order: number;
        thumbImage: string | null;
        videoTitle: string;
        fileUrl: string | null;
        courseModuleId: string;
    }>;
};
//# sourceMappingURL=courseModuleVideo.service.d.ts.map