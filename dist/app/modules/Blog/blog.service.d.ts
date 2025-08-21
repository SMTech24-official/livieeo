import { Blog } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { IGenericResponse } from "../../../interfaces/common";
export declare const BlogServices: {
    createBlogIntoDB: (payload: Blog, blogImages: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        category: string[];
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
    getAllBlogsFromDB: (query: Record<string, unknown>) => Promise<IGenericResponse<Blog[]>>;
    updateBlogIntoDB: (id: string, payload: Partial<Blog>, blogImages: IFile[]) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        category: string[];
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
    deleteBlogFromDB: (id: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        category: string[];
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
    updatePublishedStatus: (blogId: string, status: boolean) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isPublished: boolean;
        category: string[];
        publishDate: Date;
        blogTitle: string;
        content: string;
        featureMedia: string[];
    }>;
};
//# sourceMappingURL=blog.service.d.ts.map