"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCourseCertificateIntoDB = async (payload, file) => {
    const course = await prisma_1.default.course.findUnique({
        where: {
            id: payload.courseId
        }
    });
    if (!course) {
        throw new ApiError_1.default(404, "Course not found !");
    }
    const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
    payload.certificateUrl = uploadToCloudinary?.secure_url ?? "";
    const result = await prisma_1.default.courseCertificate.create({
        data: payload
    });
    return result;
};
const getAllCourseCertificatesFromDB = async () => {
    const result = await prisma_1.default.courseCertificate.findMany();
    return result;
};
exports.CourseCertificateServices = {
    createCourseCertificateIntoDB,
    getAllCourseCertificatesFromDB
};
//# sourceMappingURL=courseCertificate.service.js.map