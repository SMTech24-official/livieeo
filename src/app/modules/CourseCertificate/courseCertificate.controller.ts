import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CourseCertificateServices } from "./courseCertificate.service";
import httpStatus from "http-status";

const createCourseCertificate = catchAsync(async(req, res) => {
    const result = await CourseCertificateServices.createCourseCertificateIntoDB(req.body, req.file as IFile);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Course certificate created successfully`,
        data: result,
    });
})

const getAllCourseCertificates = catchAsync(async(req, res) => {
    const result = await CourseCertificateServices.getAllCourseCertificatesFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course certificates retrieved successfully`,
        data: result,
    });
})

export const CourseCertificateControllers = {
    createCourseCertificate,
    getAllCourseCertificates
};