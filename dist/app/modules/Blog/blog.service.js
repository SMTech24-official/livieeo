"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
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
        .search(["blogTitle", "category"])
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
const getSingleBlogFromDB = async (blogId) => {
    const blog = await prisma_1.default.blog.findUnique({
        where: { id: blogId },
    });
    if (!blog) {
        throw new ApiError_1.default(404, "Blog not found");
    }
    return blog;
};
const getPublishedBlogsFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.blog, query);
    const blogs = await queryBuilder
        // .range()
        .search(["blogTitle", "category"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            isPublished: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: blogs };
};
const getRelatedBlogsFromDB = async (blogId, query) => {
    // 1) আগে current blog বের করবো
    const currentBlog = await prisma_1.default.blog.findUnique({
        where: { id: blogId },
    });
    if (!currentBlog) {
        throw new ApiError_1.default(404, "Blog not found");
    }
    // 2) QueryBuilder দিয়ে related blogs আনবো
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.blog, query);
    const blogs = await queryBuilder
        // .range()
        .search(["blogTitle", "category"])
        .filter(["category"])
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            id: { not: blogId }, // নিজের ব্লগ বাদ
            category: { equals: currentBlog.category }, // একই category (array field তাই `hasSome`)
            isPublished: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    const meta = await queryBuilder.countTotal();
    if (!blogs || blogs.length === 0) {
        throw new ApiError_1.default(404, "No related blogs found");
    }
    return { meta, data: blogs };
};
const updateBlogIntoDB = async (id, payload, blogImages) => {
    const existingBlog = await prisma_1.default.blog.findUnique({
        where: { id }
    });
    if (!existingBlog) {
        throw new Error('Blog not found');
    }
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
    const existingBlog = await prisma_1.default.blog.findUnique({
        where: { id }
    });
    if (!existingBlog) {
        throw new Error('Blog not found');
    }
    await prisma_1.default.blog.delete({
        where: { id }
    });
    return { message: 'Blog deleted successfully' };
};
const updatePublishedStatus = async (blogId) => {
    const existingBlog = await prisma_1.default.blog.findUnique({
        where: { id: blogId }
    });
    if (!existingBlog) {
        throw new Error('Blog not found');
    }
    const result = await prisma_1.default.blog.update({
        where: { id: blogId },
        data: { isPublished: true, publishDate: new Date() },
    });
    return result;
};
exports.BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    getPublishedBlogsFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
    updatePublishedStatus,
    getRelatedBlogsFromDB,
    getSingleBlogFromDB
};
//# sourceMappingURL=blog.service.js.map