import { CourseCertificate } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
export declare const CourseCertificateServices: {
    createCourseCertificateIntoDB: (payload: CourseCertificate, userJwt: JwtPayload) => Promise<{
        id: string;
        userId: string;
        courseId: string;
        certificateNo: string;
        certificateUrl: string;
        verifyCode: string;
        issuedAt: Date;
    }>;
    verifyCourseCertificateFromDB: (code: string) => Promise<{
        valid: boolean;
        certificateNo: string;
        url: string;
        user: {
            firstName: string;
            lastName: string | null;
            email: string;
        };
        course: {
            courseTitle: string;
            mentorName: string;
        };
        issuedAt: Date;
    }>;
    getMyCertificatesFromDB: (query: Record<string, any>, user: JwtPayload) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPage: number;
        };
        data: any;
    }>;
};
//# sourceMappingURL=courseCertificate.service.d.ts.map