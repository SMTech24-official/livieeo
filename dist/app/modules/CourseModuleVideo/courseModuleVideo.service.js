"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleVideoServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
// const createCourseModuleVideoIntoDB = async (payload: CourseModuleVideo, file: IFile) => {
//     const courseModule = await prisma.courseModule.findUnique({
//         where: {
//             id: payload.courseModuleId
//         }
//     })
//     if(!courseModule){
//         throw new ApiError(404,"Course module not found !")
//     }
//     const uploadToCloudinary = await fileUploader.uploadVideoToCloudinary(file);
//     payload.fileUrl = uploadToCloudinary?.secure_url ?? "";
//     const result = await prisma.courseModuleVideo.create({data: payload});
//     return result
// }
// courseModuleVideo.service.ts
const createCourseModuleVideoIntoDB = async (payload, thumbImage, video) => {
    const courseModule = await prisma_1.default.courseModule.findUnique({
        where: { id: payload.courseModuleId },
    });
    if (!courseModule) {
        throw new ApiError_1.default(404, "Course module not found !");
    }
    // 1) Thumb image upload
    if (thumbImage) {
        const uploadThumb = await fileUploader_1.fileUploader.uploadToCloudinary(thumbImage);
        payload.thumbImage = uploadThumb?.secure_url ?? "";
    }
    // 2) Video upload
    if (video) {
        const uploadVideo = await fileUploader_1.fileUploader.uploadVideoToCloudinary(video);
        payload.fileUrl = uploadVideo?.secure_url ?? "";
    }
    const result = await prisma_1.default.courseModuleVideo.create({ data: payload });
    return result;
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