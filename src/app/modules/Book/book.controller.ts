import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookServices } from "./book.service";
import httpStatus from "http-status";

const createBook = catchAsync(async (req, res) => {
    const files = req.files as {
        book?: Express.Multer.File[],
        bookCover?: Express.Multer.File[]
    };

    const bookFile = files.book ? (files.book[0] as IFile) : undefined;
    const bookCoverFile = files.bookCover ? (files.bookCover[0] as IFile) : undefined;

    const result = await BookServices.createBookIntoDB(req.body, bookFile!, bookCoverFile!);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Book created successfully`,
        data: result,
    });
});
const getAllBooks = catchAsync(async (req, res) => {
    const result = await BookServices.getAllBooksFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Books retrieved successfully`,
        data: result,
    });
});
const getBookById = catchAsync(async (req, res) => {
    const result = await BookServices.getBookByIdFromDB(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book retrieved successfully`,
        data: result,
    });
});
const updateBook = catchAsync(async (req, res) => {
    const result = await BookServices.updateBookInDB(req.params.id as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book updated successfully`,
        data: result,
    });
});
const deleteBook = catchAsync(async (req, res) => {
    const result = await BookServices.deleteBookFromDB(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book deleted successfully`,
        data: result,
    });
});
export const BookControllers = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
};