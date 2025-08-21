"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const createBlogIntoDB = async (payload, blogImages) => {
    if (blogImages && blogImages.length > 0) {
        const uploadBlogImages = await fileUploader_1.fileUploader.uploadMultipleToCloudinary(blogImages);
        payload.featureMedia = uploadBlogImages.map(img => img.secure_url) ?? [];
    }
    const result = await prisma_1.default.blog.create({
        data: payload
    });
    return result;
};
const getAllBlogsFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.blog, query);
    const blogs = await queryBuilder.range()
        .search(["blogTitle"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
        orderBy: {
            createdAt: 'desc'
        }
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: blogs };
};
const updateBlogIntoDB = async (id, payload, blogImages) => {
    if (blogImages && blogImages.length > 0) {
        const uploadBlogImages = await fileUploader_1.fileUploader.uploadMultipleToCloudinary(blogImages);
        payload.featureMedia = uploadBlogImages.map(img => img.secure_url) ?? [];
    }
    const result = await prisma_1.default.blog.update({
        where: { id },
        data: payload
    });
    return result;
};
const deleteBlogFromDB = async (id) => {
    const result = await prisma_1.default.blog.delete({
        where: { id }
    });
    return result;
};
const updatePublishedStatus = async (blogId, status) => {
    const result = await prisma_1.default.blog.update({
        where: { id: blogId },
        data: { isPublished: status },
    });
    return result;
};
exports.BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
    updatePublishedStatus
};
//# sourceMappingURL=blog.service.js.map