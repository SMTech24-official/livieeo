import { Course, Prisma } from "@prisma/client";
import { IGenericResponse } from "../../../interfaces/common";
import { IFile } from "../../../interfaces/file";
type VideoStatus = "locked" | "current" | "completed";
interface CourseDetailsView {
    id: string;
    courseTitle: string;
    mentorName: string;
    category: string;
    price: number;
    discountPrice: number;
    language: string;
    duration: string;
    description: string;
    purchased: boolean;
    percentCompleted: number;
    summary: {
        totalModules: number;
        completedModules: number;
        totalVideos: number;
        completedVideos: number;
    };
    modules: {
        id: string;
        moduleTitle: string;
        order: number;
        completed: boolean;
        videos: {
            id: string;
            videoTitle: string;
            fileUrl: string;
            order: number;
            status: VideoStatus;
        }[];
    }[];
    certificate?: {
        certificateNo: string;
        certificateUrl: string;
    } | null;
}
export declare const CourseServices: {
    createCourseIntoDB: (payload: Course, file: IFile) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        discountPrice: number;
        description: string;
        language: string;
        category: string;
        isPublished: boolean;
        courseTitle: string;
        mentorName: string;
        totalVideo: number;
        duration: string;
        thumbImage: string | null;
    }>;
    getAllCoursesFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Course[]>>;
    updatePublishedStatus: (courseId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        discountPrice: number;
        description: string;
        language: string;
        category: string;
        isPublished: boolean;
        courseTitle: string;
        mentorName: string;
        totalVideo: number;
        duration: string;
        thumbImage: string | null;
    }>;
    updateCourseIntoDB: (courseId: string, payload: Prisma.CourseUpdateInput) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        discountPrice: number;
        description: string;
        language: string;
        category: string;
        isPublished: boolean;
        courseTitle: string;
        mentorName: string;
        totalVideo: number;
        duration: string;
        thumbImage: string | null;
    }>;
    getPublishedCoursesFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Course[]>>;
    deleteCourseFromDB: (id: string) => Promise<{
        message: string;
    }>;
    getRelatedCoursesFromDB: (courseId: string, query: Record<string, unknown>) => Promise<IGenericResponse<Course[]>>;
    getSingleCourseFromDB: (courseId: string, userId?: string) => Promise<CourseDetailsView>;
};
export {};
//# sourceMappingURL=course.service.d.ts.map