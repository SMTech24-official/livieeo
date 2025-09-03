import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpeakingSampleServices } from "./speakingSample.service";
import httpStatus from 'http-status'

const createSpeakingSample = catchAsync(async (req, res) => {
    const file = req.file as IFile;
    const result = await SpeakingSampleServices.createSpeakingSampleIntoDB(req.body, file);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Speaking sample created successfully`,
        data: result,
    });
})
const getAllSpeakingSample = catchAsync(async (req, res) => {
    const result = await SpeakingSampleServices.getAllSpeakingSampleFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Speaking samples retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getRelatedSpeakingSample = catchAsync(async (req, res) => {
    const result = await SpeakingSampleServices.getAllSpeakingSampleFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Related speaking samples retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getSpeakingSampleById = catchAsync(async (req, res) => {
    const {speakingSampleId} = req.params
    const result = await SpeakingSampleServices.getSpeakingSampleById(speakingSampleId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Speaking sample retrieved successfully`,
        data: result
    });
})
const updateSpeakingSample = catchAsync(async (req, res) => {
    const {speakingSampleId} = req.params
    const result = await SpeakingSampleServices.updateSpeakingSampleIntoDB(speakingSampleId as string,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Speaking sample updated successfully`,
        data: result
    });
})
const deleteSpeakingSample = catchAsync(async (req, res) => {
    const {speakingSampleId} = req.params
    const result = await SpeakingSampleServices.deleteSpeakingSampleFromDB(speakingSampleId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Speaking sample deleted successfully`,
        data: result
    });
})
export const SpeakingSampleControllers = {
    createSpeakingSample,
    getAllSpeakingSample,
    getSpeakingSampleById,
    updateSpeakingSample,
    deleteSpeakingSample,
    getRelatedSpeakingSample
}