import { Blog } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createBlogIntoDB = async (payload: Blog, blogImage: IFile) => {
    if (blogImage) {
        const uploadBlogImage = await fileUploader.uploadToCloudinary(blogImage);
        payload.featureMedia = uploadBlogImage?.secure_url ?? "";
    }
    const result = await prisma.blog.create({
        data: payload
    });
    return result;
}

export const BlogServices = {
    createBlogIntoDB
}