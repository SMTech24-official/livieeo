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
        meta: result.meta,
        data: result.data
    })
})
const getSingleBlog = catchAsync(async (req, res) => {
    const {blogId} = req.params
    const result = await BlogServices.getSingleBlogFromDB(blogId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Blog retrieved successfully",
        data: result
    })
})

const getPublishedBlogs = catchAsync(async (req, res) => {
    const result = await BlogServices.getPublishedBlogsFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Published blogs retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

const getRelatedBlogs = catchAsync(async(req,res)=> {
    const {blogId} = req.params
    const result = await BlogServices.getRelatedBlogsFromDB(blogId as string, req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Related blogs retrieved successfully",
        meta: result.meta,
        data: result.data
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
    const result = await BlogServices.updatePublishedStatus(id as string);
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
    updatePublishedStatus,
    getRelatedBlogs,
    getSingleBlog
}