"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCourseModuleIntoDB = async (payload) => {
    // payload হবে array of modules
    const result = await Promise.all(payload.map(async (item) => {
        // 1) Check if module already exists (if id is given)
        if (item.id) {
            const isExist = await prisma_1.default.courseModule.findFirst({
                where: { id: item.id },
            });
            if (isExist) {
                return null; // skip existing
            }
        }
        // 2) Create new course module
        const newModule = await prisma_1.default.courseModule.create({
            data: {
                moduleTitle: item.moduleTitle,
                courseId: item.courseId,
                order: item.order ?? 0, // optional ordering
            },
        });
        return newModule;
    }));
    return result.filter(Boolean); // remove null values
};
const updateCourseModuleIntoDB = async (moduleId, payload) => {
    // 1️⃣ Course আছে কিনা check করা
    const existingCourse = await prisma_1.default.courseModule.findUnique({
        where: { id: moduleId },
    });
    if (!existingCourse) {
        throw new ApiError_1.default(404, "Module not found!");
    }
    // 2️⃣ শুধু valid field গুলো পাঠানো (undefined বাদ দিয়ে)
    const updateData = {};
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) {
            updateData[key] = value;
        }
    });
    // 3️⃣ এখন update করা
    const result = await prisma_1.default.courseModule.update({
        where: { id: moduleId },
        data: updateData,
    });
    return result;
};
const deleteCourseModuleFromDB = async (id) => {
    const module = await prisma_1.default.courseModule.findUnique({
        where: { id },
        include: { courseModuleVideos: true },
    });
    if (!module) {
        throw new ApiError_1.default(404, "Course Module not found!");
    }
    // 2️⃣ CourseModule → CourseModuleVideo delete
    if (module.courseModuleVideos.length > 0) {
        await prisma_1.default.courseModuleVideo.deleteMany({
            where: { courseModuleId: module.id },
        });
    }
    await prisma_1.default.courseModule.delete({
        where: { id },
    });
    return { message: "Course and all associated data deleted successfully" };
};
const getAllCourseModulesFromDB = async () => {
    const result = await prisma_1.default.courseModule.findMany();
    return result;
};
const getCourseModuleByIdFromDB = async (id) => {
    const result = await prisma_1.default.courseModule.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return result;
};
exports.CourseModuleServices = {
    createCourseModuleIntoDB,
    updateCourseModuleIntoDB,
    deleteCourseModuleFromDB,
    getAllCourseModulesFromDB,
    getCourseModuleByIdFromDB,
};
//# sourceMappingURL=courseModule.service.js.map