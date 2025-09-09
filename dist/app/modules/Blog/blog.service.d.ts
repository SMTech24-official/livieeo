import { Blog, Prisma } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { IGenericResponse } from "../../../interfaces/common";
export declare const BlogServices: {
    createBlogIntoDB: (payload: Prisma.BlogCreateInput, blogImages: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
    getAllBlogsFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Blog[]>>;
    getPublishedBlogsFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Blog[]>>;
    updateBlogIntoDB: (id: string, payload: Partial<Blog>, blogImages: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
    deleteBlogFromDB: (id: string) => Promise<{
        message: string;
    }>;
    updatePublishedStatus: (blogId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
    getRelatedBlogsFromDB: (blogId: string, query: Record<string, unknown>) => Promise<IGenericResponse<Blog[]>>;
    getSingleBlogFromDB: (blogId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        isPublished: boolean;
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
};
//# sourceMappingURL=blog.service.d.ts.map