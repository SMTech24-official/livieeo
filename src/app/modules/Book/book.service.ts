import { Book } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import ApiError from "../../../errors/ApiError";

const createBookIntoDB = async (payload: Book, book: IFile, bookCover: IFile) => {

    if (book) {
        const uploadBook = await fileUploader.uploadToCloudinary(book);
        payload.book = uploadBook?.secure_url ?? "";
    }
    if (bookCover) {
        const uploadBookCover = await fileUploader.uploadToCloudinary(bookCover);
        payload.bookCover = uploadBookCover?.secure_url ?? "";
    }
    const result = await prisma.book.create({
        data: payload
    });
    return result;
}

const getAllBooksFromDB = async (query: Record<string, any>): Promise<IGenericResponse<Book[]>> => {
    const queryBuilder = new QueryBuilder(prisma.book, query)
    const books = await queryBuilder
        .range()
        .search(["bookName"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute();
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError(404, "No books found");
    }
    return { meta, data: books };
};
const getPublishedBooksFromDB = async (query: Record<string, any>): Promise<IGenericResponse<Book[]>> => {
    const queryBuilder = new QueryBuilder(prisma.book, query)
    const books = await queryBuilder
        .range()
        .search(["bookName"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute(
            {
                isPublished: true
            }
        );
    const meta = await queryBuilder.countTotal();
    if (!books || books.length === 0) {
        throw new ApiError(404, "No books found");
    }
    return { meta, data: books };
};

const getBookByIdFromDB = async (id: string) => {
    const result = await prisma.book.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
}

const updateBookInDB = async (id: string, payload: Partial<Book>) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    })
    if (!book) {
        throw new ApiError(404, "Book not found!")
    }
    const result = await prisma.book.update({
        where: { id },
        data: payload
    });
    return result;
}
const deleteBookFromDB = async (id: string) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    })
    if (!book) {
        throw new ApiError(404, "Book not found!")
    }
    const result = await prisma.book.delete({
        where: { id }
    });
    return result;
}
const updatePublishedStatus = async (id: string, status: boolean) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    })
    if (!book) {
        throw new ApiError(404, "Book not found!")
    }
    const result = await prisma.book.update({
        where: { id },
        data: { isPublished: status }
    });
    return result;
}

const getRelatedBooks = async (bookId: string): Promise<Book[]> => {
    const books = await prisma.book.findMany({
        where: {
            id: {
                not: bookId
            },
            isPublished: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return books;
}
const ratingToBook = async (bookId: string, rating: number) => {
    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })
    if (!book) {
        throw new ApiError(404, "Book not found!")
    }
    const result = await prisma.book.update({
        where: { id: bookId },
        data: { rating  }
    })
    return result;
}

export const BookServices = {
    createBookIntoDB,
    getAllBooksFromDB,
    getPublishedBooksFromDB,
    getBookByIdFromDB,
    updateBookInDB,
    deleteBookFromDB,
    updatePublishedStatus,
    getRelatedBooks,
    ratingToBook
};