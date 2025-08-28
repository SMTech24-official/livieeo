import { CourseCertificate, PaymentStatus } from "@prisma/client";
import QRCode from "qrcode";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import { nextSequence } from "../../../helpers/sequence";
import config from "../../../config";
import { certificateHTML } from "./courseCertificate.template";
import prisma from "../../../shared/prisma"; // ensure prisma imported
import { fileUploader } from "../../../helpers/fileUploader"; // ensure uploader imported
import ApiError from "../../../errors/ApiError"; // ensure custom error
import { JwtPayload } from "jsonwebtoken";
import { generateCertificatePDF } from "./generateCertificatePdf";
import QueryBuilder from "../../../helpers/queryBuilder";

// ==========================
// সার্টিফিকেট ক্রিয়েট
// ==========================

const createCourseCertificateIntoDB = async (payload: CourseCertificate, userJwt: JwtPayload) => {
    const { courseId } = payload;
    const userId = typeof userJwt === "string" ? userJwt : userJwt?.id;

    // 1) কোর্স/ইউজার চেক
    const [user, course] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.course.findUnique({ where: { id: courseId } }),
    ]);
    if (!user || !course) {
        throw new ApiError(httpStatus.NOT_FOUND, "User or Course not found");
    }

    // 2) ইউজার সত্যি কোর্সটি কিনেছে কিনা
const paid = await prisma.orderCourse.findFirst({
  where: {
    userId,
    paymentStatus: PaymentStatus.PAID,
    OR: [
      { courseId }, // single course order case
      {
        items: {
          some: { courseId }, // multiple course order case
        },
      },
    ],
  },
  include: {
    items: true,
  },
});
    if (!paid) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "Certificate cannot be issued before purchase is completed"
        );
    }

    

    // 3) আগে ইস্যু করা আছে কি-না?
    const exists = await prisma.courseCertificate.findFirst({
        where: { userId, courseId },
    });
    if (exists) return exists;

    // 4) সিরিয়াল নম্বর / ভেরিফিকেশন কোড
    const seq = await nextSequence("CERT");
    const certificateNo = `CERT-${dayjs().format("YYYY")}-${String(seq).padStart(6, "0")}`;
    const verifyCode = uuidv4().replace(/-/g, "").slice(0, 12).toUpperCase();
    const verifyUrl = `${config.base_url}/certificates/verify/${verifyCode}`;

    // 5) QR কোড
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    // 6) HTML তৈরি
    const html = certificateHTML({
        studentName: `${user.firstName} ${user.lastName}`,
        courseTitle: course.courseTitle,
        mentorName: course.mentorName,
        dateStr: dayjs().format("D MMM, YYYY"),
        certificateNo,
        qrDataUrl,
        brand: "LIVIEEO ACADEMY",
    });

    // 7) Utility function দিয়ে PDF বানানো
    const pdfBuffer = await generateCertificatePDF(html);

    // 8) Cloudinary তে আপলোড
    const upload: any = await fileUploader.uploadPdfBuffer(Buffer.from(pdfBuffer), certificateNo);

    // 9) DB তে সেভ
    const cert = await prisma.courseCertificate.create({
        data: {
            courseId,
            userId,
            certificateNo,
            certificateUrl: upload.secure_url,
            verifyCode,
        },
    });

    return cert;
};


// ==========================
// সার্টিফিকেট ভেরিফাই
// ==========================
const verifyCourseCertificateFromDB = async (code: string) => {
    const cert = await prisma.courseCertificate.findUnique({
        where: { verifyCode: code },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            course: { select: { courseTitle: true, mentorName: true } },
        },
    });
    if (!cert) throw new ApiError(httpStatus.NOT_FOUND, "Certificate not found");

    return {
        valid: true,
        certificateNo: cert.certificateNo,
        url: cert.certificateUrl,
        user: cert.user,
        course: cert.course,
        issuedAt: cert.issuedAt,
    };
}

const getMyCertificatesFromDB = async (query: Record<string, any>, user: JwtPayload) => {
    const userId = typeof user === "string" ? user : user?.id;
    const queryBuilder = new QueryBuilder(prisma.courseCertificate, query);
    const certificates = await queryBuilder
        .range()
        .search([""])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            where: { userId },
            include: {
                course: { select: { courseTitle: true, mentorName: true } },
            },
            orderBy: { issuedAt: "desc" }
        });
    const meta = await queryBuilder.countTotal();
    return { meta, data: certificates }
}

export const CourseCertificateServices = {
    createCourseCertificateIntoDB,
    verifyCourseCertificateFromDB,
    getMyCertificatesFromDB
};