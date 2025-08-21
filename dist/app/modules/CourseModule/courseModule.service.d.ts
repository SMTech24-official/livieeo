import { CourseModule } from "@prisma/client";
export declare const CourseModuleServices: {
    createCourseModuleIntoDB: (payload: CourseModule) => Promise<{
        id: string;
        moduleTitle: string;
        courseId: string;
    }>;
    getAllCourseModulesFromDB: () => Promise<{
        id: string;
        moduleTitle: string;
        courseId: string;
    }[]>;
    getCourseModuleByIdFromDB: (id: string) => Promise<{
        id: string;
        moduleTitle: string;
        courseId: string;
    }>;
};
//# sourceMappingURL=courseModule.service.d.ts.map