import { Blog, Course } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";

const createBlogIntoDB = async (payload: Blog, blogImages: IFile[]) => {
    if (blogImages && blogImages.length > 0) {
        const uploadBlogImages = await fileUploader.uploadMultipleToCloudinary(blogImages);
        payload.featureMedia = uploadBlogImages.map(img => img.secure_url) ?? [];
    }
    const result = await prisma.blog.create({
        data: payload
    });
    return result;
}

const getAllBlogsFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Blog[]>> => {
    const queryBuilder = new QueryBuilder(prisma.blog, query)
        const blogs = await queryBuilder.range()
        .search(["blogTitle"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
            orderBy: {
            createdAt: 'desc'
        }
        });
        const meta = await queryBuilder.countTotal();
    return {meta,data: blogs}
}
const updateBlogIntoDB = async (id: string, payload: Partial<Blog>, blogImages: IFile[]) => {
    if (blogImages && blogImages.length > 0) {
        const uploadBlogImages = await fileUploader.uploadMultipleToCloudinary(blogImages);
        payload.featureMedia = uploadBlogImages.map(img => img.secure_url) ?? [];
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
const updatePublishedStatus = async (blogId: string, status: boolean) => {
    const result = await prisma.blog.update({
        where: { id: blogId },
        data: { isPublished: status },
    });
    return result;
}

export const BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
    updatePublishedStatus
}