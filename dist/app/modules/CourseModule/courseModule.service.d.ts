import { CourseModule } from "@prisma/client";
export declare const CourseModuleServices: {
    createCourseModuleIntoDB: (payload: CourseModule) => Promise<{
        id: string;
        courseId: string;
        order: number;
        moduleTitle: string;
    }>;
    getAllCourseModulesFromDB: () => Promise<{
        id: string;
        courseId: string;
        order: number;
        moduleTitle: string;
    }[]>;
    getCourseModuleByIdFromDB: (id: string) => Promise<{
        id: string;
        courseId: string;
        order: number;
        moduleTitle: string;
    }>;
};
//# sourceMappingURL=courseModule.service.d.ts.map