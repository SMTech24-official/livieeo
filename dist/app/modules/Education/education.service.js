"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createEducationIntoDB = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: payload.userId
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found !');
    }
    const result = await prisma_1.default.education.create({
        data: payload
    });
    return result;
};
const updateEducationIntoDB = async (id, payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: payload.userId
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found !');
    }
    const result = await prisma_1.default.education.update({
        where: { id },
        data: payload
    });
    return result;
};
const deleteEducationFromDB = async (id) => {
    const result = await prisma_1.default.education.delete({
        where: { id }
    });
    return result;
};
const getEducationByIdFromDB = async (id) => {
    const result = await prisma_1.default.education.findUnique({
        where: { id }
    });
    return result;
};
const getEducationsFromDB = async () => {
    const result = await prisma_1.default.education.findMany();
    return result;
};
exports.EducationServices = {
    createEducationIntoDB,
    updateEducationIntoDB,
    deleteEducationFromDB,
    getEducationByIdFromDB,
    getEducationsFromDB
};
//# sourceMappingURL=education.service.js.map