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
const updateBook = catchAsync(async (req, res) => {
    const files = req.files as {
        book?: Express.Multer.File[],
        bookCover?: Express.Multer.File[]
    };

    const bookFile = files.book ? (files.book[0] as IFile) : undefined;
    const bookCoverFile = files.bookCover ? (files.bookCover[0] as IFile) : undefined;

    const result = await BookServices.updateBookInDB(req.params.id as string, req.body, bookFile!, bookCoverFile!);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book updated successfully`,
        data: result,
    });
});
const getAllBooks = catchAsync(async (req, res) => {
    const result = await BookServices.getAllBooksFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Books retrieved successfully`,
        data: result,
    });
});
const getPublishedBooks = catchAsync(async (req, res) => {
    const result = await BookServices.getPublishedBooksFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `published books retrieved successfully`,
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

const deleteBook = catchAsync(async (req, res) => {
    const result = await BookServices.deleteBookFromDB(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book deleted successfully`,
        data: result,
    });
});
const updatePublishedStatus = catchAsync(async (req, res) => {
    const result = await BookServices.updatePublishedStatus(req.params.id as string, req.body.isPublished);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book published status updated successfully`,
        data: result,
    })
})
const getRelatedBooks = catchAsync(async (req, res) => {
    const { bookId } = req.params
    const result = await BookServices.getRelatedBooksFromDB(bookId as string, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Related books retrieved successfully`,
        data: result,
    });
});
const ratingToBook = catchAsync(async (req, res) => {
    const { bookId } = req.params
    const result = await BookServices.ratingToBook(bookId as string, req.body.rating);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Thank you for your rating !`,
        data: result,
    });
});
export const BookControllers = {
    createBook,
    getAllBooks,
    getPublishedBooks,
    getBookById,
    updateBook,
    deleteBook,
    updatePublishedStatus,
    ratingToBook,
    getRelatedBooks
};