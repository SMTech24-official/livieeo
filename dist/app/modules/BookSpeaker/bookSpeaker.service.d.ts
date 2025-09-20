import { BookSpeaker, Prisma } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { IGenericResponse } from "../../../interfaces/common";
export declare const BookSpeakerServices: {
    createBookSpeakerIntoDB: (payload: Prisma.BookSpeakerCreateInput, file: IFile) => Promise<{
        name: string;
        id: string;
        email: string;
        bio: string;
        contactNumber: string;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        language: string;
        profession: string;
        location: string;
        experience: string;
        expertise: string[];
        achievements: string[];
        reasons: string;
        imageUrl: string;
    }>;
    getAllBookSpeakerFromDB: (query: Record<string, any>) => Promise<IGenericResponse<BookSpeaker[]>>;
    getBookSpeakerByIdFromDB: (speakerId: string) => Promise<{
        name: string;
        id: string;
        email: string;
        bio: string;
        contactNumber: string;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        language: string;
        profession: string;
        location: string;
        experience: string;
        expertise: string[];
        achievements: string[];
        reasons: string;
        imageUrl: string;
    }>;
    updateBookSpeakerIntoDB: (speakerId: string, payload: Partial<BookSpeaker>) => Promise<{
        name: string;
        id: string;
        email: string;
        bio: string;
        contactNumber: string;
        createdAt: Date;
        updatedAt: Date;
        date: string;
        language: string;
        profession: string;
        location: string;
        experience: string;
        expertise: string[];
        achievements: string[];
        reasons: string;
        imageUrl: string;
    }>;
    deleteBookSpeakerFromDB: (speakerId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=bookSpeaker.service.d.ts.map