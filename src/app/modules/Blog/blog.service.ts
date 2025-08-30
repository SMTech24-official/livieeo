import { Blog, Course, Prisma } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";

const createBlogIntoDB = async (payload: Prisma.BlogCreateInput, blogImages: IFile[]) => {
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
        .search(["blogTitle","category"])
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
    return { meta, data: blogs }
}
const getPublishedBlogsFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Blog[]>> => {
    const queryBuilder = new QueryBuilder(prisma.blog, query)
    const blogs = await queryBuilder.range()
        .search(["blogTitle","category"])
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
    return { meta, data: blogs }
}
const updateBlogIntoDB = async (id: string, payload: Partial<Blog>, blogImages: IFile[]) => {
    const existingBlog = await prisma.blog.findUnique({
        where: { id }
    })
    if (!existingBlog) {
        throw new Error('Blog not found');
    }
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
    const existingBlog = await prisma.blog.findUnique({
        where: { id }
    })
    if (!existingBlog) {
        throw new Error('Blog not found');
    }
    const result = await prisma.blog.delete({
        where: { id }
    });
    return { message: 'Blog deleted successfully'};
}

const updatePublishedStatus = async (blogId: string) => {
    const existingBlog = await prisma.blog.findUnique({
        where: { id:blogId }
    })
    if (!existingBlog) {
        throw new Error('Blog not found');
    }
    const result = await prisma.blog.update({
        where: { id: blogId },
        data: { isPublished: true, publishDate: new Date() },
    });
    return result;
}

export const BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    getPublishedBlogsFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB,
    updatePublishedStatus
}