import { CourseModuleVideo } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
export declare const CourseModuleVideoServices: {
    createCourseModuleVideoIntoDB: (payload: CourseModuleVideo, file: IFile) => Promise<{
        id: string;
        order: number;
        videoTitle: string;
        fileUrl: string;
        courseModuleId: string;
    }>;
    getAllCourseModuleVideosFromDB: () => Promise<{
        id: string;
        order: number;
        videoTitle: string;
        fileUrl: string;
        courseModuleId: string;
    }[]>;
    getCourseModuleVideoByIdFromDB: (id: string) => Promise<{
        id: string;
        order: number;
        videoTitle: string;
        fileUrl: string;
        courseModuleId: string;
    } | null>;
    updateCourseModuleVideoInDB: (id: string, payload: CourseModuleVideo) => Promise<{
        id: string;
        order: number;
        videoTitle: string;
        fileUrl: string;
        courseModuleId: string;
    }>;
    deleteCourseModuleVideoFromDB: (id: string) => Promise<{
        id: string;
        order: number;
        videoTitle: string;
        fileUrl: string;
        courseModuleId: string;
    }>;
};
//# sourceMappingURL=courseModuleVideo.service.d.ts.map