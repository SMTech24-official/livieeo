"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
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