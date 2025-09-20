"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleVideoServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCourseModuleVideoIntoDB = async (payload, files) => {
    const results = await Promise.all(payload.map(async (item, index) => {
        // 1) Check course module exists
        const courseModule = await prisma_1.default.courseModule.findUnique({
            where: { id: item.courseModuleId },
        });
        if (!courseModule) {
            throw new ApiError_1.default(404, "Course module not found !");
        }
        // 2) If id exists, check duplicate
        if (item.id) {
            const isExist = await prisma_1.default.courseModuleVideo.findFirst({
                where: { id: item.id },
            });
            if (isExist)
                return null;
        }
        // 3) Handle thumb upload (if exists)
        const thumbFile = files?.[`thumb-${index}`];
        if (thumbFile) {
            const uploadThumb = await fileUploader_1.fileUploader.uploadToCloudinary(thumbFile);
            item.thumbImage = uploadThumb?.secure_url ?? "";
        }
        // 4) Handle video upload (if exists)
        const videoFile = files?.[`video-${index}`];
        if (videoFile) {
            const uploadVideo = await fileUploader_1.fileUploader.uploadVideoToCloudinary(videoFile);
            item.fileUrl = uploadVideo?.secure_url ?? "";
        }
        // 5) Create video record
        return prisma_1.default.courseModuleVideo.create({ data: item });
    }));
    return results.filter((x) => Boolean(x));
};
const getAllCourseModuleVideosFromDB = async () => {
    const result = await prisma_1.default.courseModuleVideo.findMany();
    return result;
};
const getCourseModuleVideoByIdFromDB = async (id) => {
    const result = await prisma_1.default.courseModuleVideo.findUnique({
        where: {
            id
        }
    });
    return result;
};
const updateCourseModuleVideoInDB = async (id, payload) => {
    const result = await prisma_1.default.courseModuleVideo.update({
        where: { id },
        data: payload
    });
    return result;
};
const deleteCourseModuleVideoFromDB = async (id) => {
    const result = await prisma_1.default.courseModuleVideo.delete({
        where: { id }
    });
    return result;
};
exports.CourseModuleVideoServices = {
    createCourseModuleVideoIntoDB,
    getAllCourseModuleVideosFromDB,
    getCourseModuleVideoByIdFromDB,
    updateCourseModuleVideoInDB,
    deleteCourseModuleVideoFromDB
};
//# sourceMappingURL=courseModuleVideo.service.js.map