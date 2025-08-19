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

export const SpeakingSampleControllers = {
    createSpeakingSample
}