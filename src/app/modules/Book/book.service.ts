import { Book } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";

const createBookIntoDB = async (payload: Book, file: IFile) => {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.book = uploadToCloudinary?.secure_url ?? "";
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
const updateBookInDB = async (id: string, payload: Book) => {
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