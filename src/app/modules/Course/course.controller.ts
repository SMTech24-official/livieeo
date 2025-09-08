import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CourseServices } from "./course.service";
import { JwtPayload } from "jsonwebtoken";

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
    const result = await CourseServices.getAllCoursesFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Courses retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getPublishedCourses = catchAsync(async (req, res) => {
    const result = await CourseServices.getPublishedCoursesFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Published courses retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getSingleCourse = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new Error("Unauthorized: user not found in request");
  }

  const { courseId } = req.params;
  const userId = req.user.id;

  const result = await CourseServices.getSingleCourseFromDB(courseId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Single course retrieved successfully`,
    data: result,
  });
});
const getRelatedCourses = catchAsync(async (req, res) => {
    const {courseId} = req.params
    const result = await CourseServices.getRelatedCoursesFromDB(courseId as string,req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Related courses retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const updatePublishedStatus = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.updatePublishedStatus(courseId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course published status updated successfully`,
        data: result,
    });
})

const deleteCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const result = await CourseServices.deleteCourseFromDB(courseId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course deleted successfully`,
        data: result,
    });
})

const updateCourse = catchAsync(async (req, res) => {
    const { courseId } = req.params;
    const payload = req.body;
    const result = await CourseServices.updateCourseIntoDB(courseId as string, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course updated successfully`,
        data: result,
    });
})

export const CourseControllers = {
    createCourse,
    getAllCourses,
    getPublishedCourses,
    updatePublishedStatus,
    deleteCourse,
    updateCourse,
    getRelatedCourses,
    getSingleCourse
}