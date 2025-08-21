import { CourseCertificate } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
export declare const CourseCertificateServices: {
    createCourseCertificateIntoDB: (payload: CourseCertificate, file: IFile) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        certificateTitle: string;
        certificateUrl: string;
    }>;
    getAllCourseCertificatesFromDB: () => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        certificateTitle: string;
        certificateUrl: string;
    }[]>;
};
//# sourceMappingURL=courseCertificate.service.d.ts.map