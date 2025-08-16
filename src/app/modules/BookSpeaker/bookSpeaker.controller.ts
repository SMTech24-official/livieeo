import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookSpeakerServices } from "./bookSpeaker.service";
import httpStatus from 'http-status'

const createBookSpeaker = catchAsync(async (req, res) => {
    const result = await BookSpeakerServices.createBookSpeakerIntoDB(req.body,req.file as IFile);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Book speaker created successfully`,
        data: result
    });
})
const getAllBookSpeaker = catchAsync(async (req, res) => {
    const result = await BookSpeakerServices.getAllBookSpeakerFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book speakers retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getBookSpeakerById = catchAsync(async (req, res) => {
    const {speakerId} = req.params
    const result = await BookSpeakerServices.getBookSpeakerByIdFromDB(speakerId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book speaker retrieved successfully`,
        data: result
    });
})
const updateBookSpeaker = catchAsync(async (req, res) => {
    const {speakerId} = req.params
    const result = await BookSpeakerServices.updateBookSpeakerIntoDB(speakerId as string,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book speaker updated successfully`,
        data: result
    });
})
const deleteBookSpeaker = catchAsync(async (req, res) => {
    const {speakerId} = req.params
    const result = await BookSpeakerServices.deleteBookSpeakerFromDB(speakerId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Book speaker deleted successfully`,
        data: result
    });
})


export const BookSpeakerControllers = {
    createBookSpeaker,
    getAllBookSpeaker,
    getBookSpeakerById,
    updateBookSpeaker,
    deleteBookSpeaker
}