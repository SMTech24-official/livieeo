import { Education } from "@prisma/client";
export declare const EducationServices: {
    createEducationIntoDB: (payload: Education) => Promise<{
        field: string | null;
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
    }>;
    updateEducationIntoDB: (id: string, payload: Education) => Promise<{
        field: string | null;
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
    }>;
    deleteEducationFromDB: (id: string) => Promise<{
        field: string | null;
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
    }>;
    getEducationByIdFromDB: (id: string) => Promise<{
        field: string | null;
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
    } | null>;
    getEducationsFromDB: () => Promise<{
        field: string | null;
        id: string;
        userId: string;
        degree: string | null;
        institution: string | null;
    }[]>;
};
//# sourceMappingURL=education.service.d.ts.map