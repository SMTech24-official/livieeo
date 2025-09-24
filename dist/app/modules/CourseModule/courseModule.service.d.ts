import { CourseModule } from "@prisma/client";
export declare const CourseModuleServices: {
    createCourseModuleIntoDB: (payload: CourseModule[]) => Promise<({
        id: string;
        courseId: string;
        order: number;
        moduleTitle: string;
    } | null)[]>;
    updateCourseModuleIntoDB: (moduleId: string, payload: CourseModule) => Promise<{
        id: string;
        courseId: string;
        order: number;
        moduleTitle: string;
    }>;
    deleteCourseModuleFromDB: (id: string) => Promise<{
        message: string;
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