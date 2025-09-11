import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CourseModuleVideoServices } from "./courseModuleVideo.service";
import httpStatus from "http-status";

// const createCourseModuleVideo = catchAsync(async (req, res) => {
//     const file = req.file as IFile;
//     const result = await CourseModuleVideoServices.createCourseModuleVideoIntoDB(req.body, file);
//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: `Course Module Video created successfully`,
//         data: result,
//     });
// })


// courseModuleVideo.controller.ts
const createCourseModuleVideo = catchAsync(async (req, res) => {
  const files = req.files as {
    thumbImage?: Express.Multer.File[];
    video?: Express.Multer.File[];
  };

  const thumbImageFile = files.thumbImage ? (files.thumbImage[0] as IFile) : undefined;
  const videoFile = files.video ? (files.video[0] as IFile) : undefined;

  const result = await CourseModuleVideoServices.createCourseModuleVideoIntoDB(
    req.body,
    thumbImageFile,
    videoFile
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Course Module Video created successfully`,
    data: result,
  });
});


const getAllCourseModuleVideos = catchAsync(async (req, res) => {
    const result = await CourseModuleVideoServices.getAllCourseModuleVideosFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course Module Videos retrieved successfully`,
        data: result,
    });
})

const getCourseModuleVideoById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseModuleVideoServices.getCourseModuleVideoByIdFromDB(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course Module Video retrieved successfully`,
        data: result,
    });
})

const updateCourseModuleVideo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseModuleVideoServices.updateCourseModuleVideoInDB(id as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course Module Video updated successfully`,
        data: result,
    });
});
const deleteCourseModuleVideo = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CourseModuleVideoServices.deleteCourseModuleVideoFromDB(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Course Module Video deleted successfully`,
        data: result,
    });
})
export const CourseModuleVideoControllers = {
    createCourseModuleVideo,
    getAllCourseModuleVideos,
    getCourseModuleVideoById,
    updateCourseModuleVideo,
    deleteCourseModuleVideo
};