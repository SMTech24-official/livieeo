import { Book } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";

const createBookIntoDB = async (payload: Book,book: IFile , bookCover: IFile) => {

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

const getAllBooksFromDB = async () => {
    const result = await prisma.book.findMany();
    return result;
};

const getBookByIdFromDB = async (id: string) => {
    const result = await prisma.book.findUnique({
        where: {
            id
        }
    });
    return result;
}
const updateBookInDB = async (id: string, payload: Partial<Book>) => {
    const result = await prisma.book.update({
        where: { id },
        data: payload
    });
    return result;
}
const deleteBookFromDB = async (id: string) => {
    const result = await prisma.book.delete({
        where: { id }
    });
    return result;
}
export const BookServices = {
    createBookIntoDB,
    getAllBooksFromDB,
    getBookByIdFromDB,
    updateBookInDB,
    deleteBookFromDB
};