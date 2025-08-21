"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCourseIntoDB = async (payload) => {
    const result = await prisma_1.default.course.create({
        data: payload
    });
    return result;
};
const getAllCoursesFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.course, query);
    const courses = await queryBuilder.range()
        .search(["courseTitle"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
        include: {
            courseModules: {
                include: {
                    courseModuleVideos: true, // প্রতিটি module এর videos
                },
            },
            courseCertificate: true, // প্রতিটি course এর certificate
        },
    });
    const meta = await queryBuilder.countTotal();
    if (!courses || courses.length === 0) {
        throw new ApiError_1.default(404, "No courses found");
    }
    return { meta, data: courses };
};
const updatePublishedStatus = async (courseId, status) => {
    const result = await prisma_1.default.course.update({
        where: { id: courseId },
        data: { isPublished: status },
    });
    return result;
};
const updateCourseIntoDB = async (courseId, payload) => {
    const result = await prisma_1.default.course.update({
        where: {
            id: courseId
        },
        data: payload
    });
    return result;
};
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    updatePublishedStatus,
    updateCourseIntoDB
};
//# sourceMappingURL=course.service.js.map