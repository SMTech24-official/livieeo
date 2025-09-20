"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialLinksServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createSocialLinkIntoDB = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: payload.userId
        }
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found !');
    }
    const result = await prisma_1.default.socialLinks.create({
        data: payload
    });
    return result;
};
const updateSocialLinkIntoDB = async (id, payload) => {
    const result = await prisma_1.default.socialLinks.update({
        where: { id },
        data: payload
    });
    return result;
};
const deleteSocialLinkFromDB = async (id) => {
    const result = await prisma_1.default.socialLinks.delete({
        where: { id }
    });
    return result;
};
const getSocialLinkByIdFromDB = async (id) => {
    const result = await prisma_1.default.socialLinks.findUnique({
        where: { id }
    });
    return result;
};
const getSocialLinksFromDB = async () => {
    const result = await prisma_1.default.socialLinks.findMany();
    return result;
};
exports.SocialLinksServices = {
    createSocialLinkIntoDB,
    updateSocialLinkIntoDB,
    deleteSocialLinkFromDB,
    getSocialLinkByIdFromDB,
    getSocialLinksFromDB
};
//# sourceMappingURL=socialLinks.service.js.map