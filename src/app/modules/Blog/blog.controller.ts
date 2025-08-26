import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BlogServices } from "./blog.service";
import httpStatus from "http-status";

const createBlog = catchAsync(async (req, res) => {
    const result = await BlogServices.createBlogIntoDB(req.body, req.files as IFile[]);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Blog created successfully",
        data: result,
    })
})

const getAllBlogs = catchAsync(async (req, res) => {
    const result = await BlogServices.getAllBlogsFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Blogs retrieved successfully",
        data: result,
    })
})

const getPublishedBlogs = catchAsync(async (req, res) => {
    const result = await BlogServices.getAllBlogsFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Published blogs retrieved successfully",
        data: result,
    })
})

const updateBlog = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BlogServices.updateBlogIntoDB(id as string, req.body, req.files as IFile[]);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Blog updated successfully",
        data: result,
    })
})

const deleteBlog = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BlogServices.deleteBlogFromDB(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    })
})
const updatePublishedStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await BlogServices.updatePublishedStatus(id as string, status);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Blog published status updated successfully",
        data: result,
    })
})

export const BlogControllers = {
    createBlog,
    getAllBlogs,
    getPublishedBlogs,
    updateBlog,
    deleteBlog,
    updatePublishedStatus
}