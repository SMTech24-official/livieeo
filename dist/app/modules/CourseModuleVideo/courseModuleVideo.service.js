"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleVideoServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCourseModuleVideoIntoDB = async (payload, file) => {
    const courseModule = await prisma_1.default.course.findUnique({
        where: {
            id: payload.courseModuleId
        }
    });
    if (!courseModule) {
        throw new ApiError_1.default(404, "Course module not found !");
    }
    const uploadToCloudinary = await fileUploader_1.fileUploader.uploadVideoToCloudinary(file);
    payload.fileUrl = uploadToCloudinary?.secure_url ?? "";
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