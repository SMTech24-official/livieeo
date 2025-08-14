import { Blog } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createBlogIntoDB = async (payload: Blog, blogImages: IFile[]) => {
    if (blogImages && blogImages.length > 0) {
        const uploadBlogImages = await fileUploader.uploadMultipleToCloudinary(blogImages);
        payload.featureMedia = uploadBlogImages.map(img => img.secure_url) ?? [] ;
    }
    const result = await prisma.blog.create({
        data: payload
    });
    return result;
}

const getAllBlogsFromDB = async () => {
    const blogs = await prisma.blog.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return blogs;
}
const updateBlogIntoDB = async (id: string, payload: Blog, blogImages: IFile[]) => {
    if (blogImages && blogImages.length > 0) {
        const uploadBlogImages = await fileUploader.uploadMultipleToCloudinary(blogImages);
        payload.featureMedia = uploadBlogImages.map(img => img.secure_url) ?? [] ;
    }
    const result = await prisma.blog.update({
        where: { id },
        data: payload
    });
    return result;
}

const deleteBlogFromDB = async (id: string) => {
    const result = await prisma.blog.delete({
        where: { id }
    });
    return result;
}

export const BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB
}