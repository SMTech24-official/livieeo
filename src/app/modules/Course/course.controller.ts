import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CourseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Course created successfully`,
        data: result,
    });
})

const getAllCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getAllCoursesFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Courses retrieved successfully`,
        data: result,
    });
})


export const CourseControllers = {
    createCourse,
    getAllCourses
}