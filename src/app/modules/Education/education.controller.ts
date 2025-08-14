import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EducationServices } from "./education.service";
import httpStatus from "http-status";

const createEducation = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await EducationServices.createEducationIntoDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Education created successfully",
        data: result
    })
})

const updateEducation = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await EducationServices.updateEducationIntoDB(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Education updated successfully",
        data: result
    })
})
const deleteEducation = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const result = await EducationServices.deleteEducationFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Education deleted successfully",
        data: result
    })
})
const getEducationById = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const result = await EducationServices.getEducationByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Education retrieved successfully",
        data: result
    })
})
const getEducations = catchAsync(async (req, res) => {
    const result = await EducationServices.getEducationsFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Educations retrieved successfully",
        data: result
    })
})
export const EducationControllers = {
    createEducation,
    updateEducation,
    deleteEducation,
    getEducationById,
    getEducations
};