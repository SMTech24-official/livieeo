"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCourseModuleIntoDB = async (payload) => {
    const course = await prisma_1.default.course.findUnique({
        where: {
            id: payload.courseId
        }
    });
    if (!course) {
        throw new ApiError_1.default(404, "Course not found !");
    }
    const result = await prisma_1.default.courseModule.create({
        data: payload
    });
    return result;
};
const getAllCourseModulesFromDB = async () => {
    const result = await prisma_1.default.courseModule.findMany();
    return result;
};
const getCourseModuleByIdFromDB = async (id) => {
    const result = await prisma_1.default.courseModule.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
};
exports.CourseModuleServices = {
    createCourseModuleIntoDB,
    getAllCourseModulesFromDB,
    getCourseModuleByIdFromDB
};
//# sourceMappingURL=courseModule.service.js.map