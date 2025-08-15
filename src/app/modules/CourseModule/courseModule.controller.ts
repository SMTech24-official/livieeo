import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CourseModuleServices } from "./courseModule.service";
import httpStatus from "http-status";

const createCourseModule = catchAsync(async (req, res) => {
    const result = await CourseModuleServices.createCourseModuleIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Course module created successfully`,
        data: result,
    });
})
const getAllCourseModules = catchAsync(async (req, res) => {
    const result = await CourseModuleServices.getAllCourseModulesFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course modules retrieved successfully`,
        data: result,
    });
})
const getCourseModuleById = catchAsync(async (req, res) => {
    const result = await CourseModuleServices.getCourseModuleByIdFromDB(req.params.id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course module retrieved successfully`,
        data: result,
    });
})
export const CourseModuleControllers = {
    createCourseModule,
    getAllCourseModules,
    getCourseModuleById
}