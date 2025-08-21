"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeakingSampleServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createSpeakingSampleIntoDB = async (payload, file) => {
    const uploadToCloudinary = await fileUploader_1.fileUploader.uploadVideoToCloudinary(file);
    payload.featureMedia = uploadToCloudinary?.secure_url ?? "";
    const result = await prisma_1.default.speakingSample.create({ data: payload });
    return result;
};
const getAllSpeakingSampleFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.speakingSample, query);
    const speakingSamples = await queryBuilder
        .range()
        .search(["sampleTitle", "content"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    return { meta, data: speakingSamples };
};
const getSpeakingSampleById = async (speakingSampleId) => {
    const result = await prisma_1.default.speakingSample.findUniqueOrThrow({
        where: {
            id: speakingSampleId
        }
    });
    return result;
};
const updateSpeakingSampleIntoDB = async (speakingSampleId, payload) => {
    const speakingSample = await prisma_1.default.speakingSample.findUnique({
        where: {
            id: speakingSampleId
        }
    });
    if (!speakingSample) {
        throw new ApiError_1.default(404, "Speaking sample not found !");
    }
    const result = await prisma_1.default.speakingSample.update({
        where: {
            id: speakingSampleId
        },
        data: payload
    });
    return result;
};
const deleteSpeakingSampleFromDB = async (speakingSampleId) => {
    const speakingSample = await prisma_1.default.speakingSample.findUnique({
        where: {
            id: speakingSampleId
        }
    });
    if (!speakingSample) {
        throw new ApiError_1.default(404, "Speaking sample not found !");
    }
    const result = await prisma_1.default.speakingSample.delete({
        where: {
            id: speakingSampleId
        }
    });
    return result;
};
exports.SpeakingSampleServices = {
    createSpeakingSampleIntoDB,
    getAllSpeakingSampleFromDB,
    getSpeakingSampleById,
    updateSpeakingSampleIntoDB,
    deleteSpeakingSampleFromDB
};
//# sourceMappingURL=speakingSample.service.js.map