import { Education } from "@prisma/client";
export declare const EducationServices: {
    createEducationIntoDB: (payload: Education) => Promise<{
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
        field: string | null;
    }>;
    updateEducationIntoDB: (id: string, payload: Education) => Promise<{
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
        field: string | null;
    }>;
    deleteEducationFromDB: (id: string) => Promise<{
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
        field: string | null;
    }>;
    getEducationByIdFromDB: (id: string) => Promise<{
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
        field: string | null;
    } | null>;
    getEducationsFromDB: () => Promise<{
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
        field: string | null;
    }[]>;
};
//# sourceMappingURL=education.service.d.ts.map