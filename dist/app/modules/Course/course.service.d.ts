import { Course } from "@prisma/client";
import { IGenericResponse } from "../../../interfaces/common";
export declare const CourseServices: {
    createCourseIntoDB: (payload: Course) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseTitle: string;
        mentorName: string;
        price: number;
        totalVideo: number;
        language: string;
        duration: string;
        description: string;
        isPublished: boolean;
        courseCertificateId: string;
    }>;
    getAllCoursesFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Course[]>>;
    updatePublishedStatus: (courseId: string, status: boolean) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseTitle: string;
        mentorName: string;
        price: number;
        totalVideo: number;
        language: string;
        duration: string;
        description: string;
        isPublished: boolean;
        courseCertificateId: string;
    }>;
    updateCourseIntoDB: (courseId: string, payload: Partial<Course>) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseTitle: string;
        mentorName: string;
        price: number;
        totalVideo: number;
        language: string;
        duration: string;
        description: string;
        isPublished: boolean;
        courseCertificateId: string;
    }>;
};
//# sourceMappingURL=course.service.d.ts.map