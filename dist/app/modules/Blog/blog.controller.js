"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const blog_service_1 = require("./blog.service");
const http_status_1 = __importDefault(require("http-status"));
const createBlog = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blog_service_1.BlogServices.createBlogIntoDB(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Blog created successfully",
        data: result,
    });
});
const getAllBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blog_service_1.BlogServices.getAllBlogsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blogs retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});
const getSingleBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { blogId } = req.params;
    const result = await blog_service_1.BlogServices.getSingleBlogFromDB(blogId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blog retrieved successfully",
        data: result
    });
});
const getPublishedBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blog_service_1.BlogServices.getPublishedBlogsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Published blogs retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});
const getRelatedBlogs = (0, catchAsync_1.default)(async (req, res) => {
    const { blogId } = req.params;
    const result = await blog_service_1.BlogServices.getRelatedBlogsFromDB(blogId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Related blogs retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});
const updateBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogServices.updateBlogIntoDB(id, req.body, req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blog updated successfully",
        data: result,
    });
});
const deleteBlog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogServices.deleteBlogFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
});
const updatePublishedStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blog_service_1.BlogServices.updatePublishedStatus(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Blog published status updated successfully",
        data: result,
    });
});
exports.BlogControllers = {
    createBlog,
    getAllBlogs,
    getPublishedBlogs,
    updateBlog,
    deleteBlog,
    updatePublishedStatus,
    getRelatedBlogs,
    getSingleBlog
};
//# sourceMappingURL=blog.controller.js.map