"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateServices = void 0;
const client_1 = require("@prisma/client");
const qrcode_1 = __importDefault(require("qrcode"));
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const http_status_1 = __importDefault(require("http-status"));
const sequence_1 = require("../../../helpers/sequence");
const config_1 = __importDefault(require("../../../config"));
const courseCertificate_template_1 = require("./courseCertificate.template");
const prisma_1 = __importDefault(require("../../../shared/prisma")); // ensure prisma imported
const fileUploader_1 = require("../../../helpers/fileUploader"); // ensure uploader imported
const ApiError_1 = __importDefault(require("../../../errors/ApiError")); // ensure custom error
const generateCertificatePdf_1 = require("./generateCertificatePdf");
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
// ==========================
// সার্টিফিকেট ক্রিয়েট
// ==========================
const createCourseCertificateIntoDB = async (payload, userJwt) => {
    const { courseId } = payload;
    const userId = typeof userJwt === "string" ? userJwt : userJwt?.id;
    // 1) কোর্স/ইউজার চেক
    const [user, course] = await Promise.all([
        prisma_1.default.user.findUnique({ where: { id: userId } }),
        prisma_1.default.course.findUnique({ where: { id: courseId } }),
    ]);
    if (!user || !course) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User or Course not found");
    }
    // 2) ইউজার সত্যি কোর্সটি কিনেছে কিনা
    const paid = await prisma_1.default.orderCourse.findFirst({
        where: {
            userId,
            paymentStatus: client_1.PaymentStatus.PAID,
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
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Certificate cannot be issued before purchase is completed");
    }
    // 3) আগে ইস্যু করা আছে কি-না?
    const exists = await prisma_1.default.courseCertificate.findFirst({
        where: { userId, courseId },
    });
    if (exists)
        return exists;
    // 4) সিরিয়াল নম্বর / ভেরিফিকেশন কোড
    const seq = await (0, sequence_1.nextSequence)("CERT");
    const certificateNo = `CERT-${(0, dayjs_1.default)().format("YYYY")}-${String(seq).padStart(6, "0")}`;
    const verifyCode = (0, uuid_1.v4)().replace(/-/g, "").slice(0, 12).toUpperCase();
    const verifyUrl = `${config_1.default.base_url}/certificates/verify/${verifyCode}`;
    // 5) QR কোড
    const qrDataUrl = await qrcode_1.default.toDataURL(verifyUrl);
    // 6) HTML তৈরি
    const html = (0, courseCertificate_template_1.certificateHTML)({
        studentName: `${user.firstName} ${user.lastName}`,
        courseTitle: course.courseTitle,
        mentorName: course.mentorName,
        dateStr: (0, dayjs_1.default)().format("D MMM, YYYY"),
        certificateNo,
        qrDataUrl,
        brand: "LIVIEEO ACADEMY",
    });
    // 7) Utility function দিয়ে PDF বানানো
    const pdfBuffer = await (0, generateCertificatePdf_1.generateCertificatePDF)(html);
    // 8) Cloudinary তে আপলোড
    const upload = await fileUploader_1.fileUploader.uploadPdfBuffer(Buffer.from(pdfBuffer), certificateNo);
    // 9) DB তে সেভ
    const cert = await prisma_1.default.courseCertificate.create({
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
const verifyCourseCertificateFromDB = async (code) => {
    const cert = await prisma_1.default.courseCertificate.findUnique({
        where: { verifyCode: code },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            course: { select: { courseTitle: true, mentorName: true } },
        },
    });
    if (!cert)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Certificate not found");
    return {
        valid: true,
        certificateNo: cert.certificateNo,
        url: cert.certificateUrl,
        user: cert.user,
        course: cert.course,
        issuedAt: cert.issuedAt,
    };
};
const getMyCertificatesFromDB = async (query, user) => {
    const userId = typeof user === "string" ? user : user?.id;
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.courseCertificate, query);
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
    return { meta, data: certificates };
};
exports.CourseCertificateServices = {
    createCourseCertificateIntoDB,
    verifyCourseCertificateFromDB,
    getMyCertificatesFromDB
};
//# sourceMappingURL=courseCertificate.service.js.map