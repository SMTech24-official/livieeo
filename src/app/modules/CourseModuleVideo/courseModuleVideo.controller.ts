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

  // ✅ Make sure body is always array
  const payload = Array.isArray(req.body) ? req.body : [req.body];

  // ✅ Convert each file into a map with index key
  const fileMap: Record<string, IFile> = {};

  if (files?.thumbImage) {
    files.thumbImage.forEach((file, index) => {
      fileMap[`thumb-${index}`] = file as IFile;
    });
  }

  if (files?.video) {
    files.video.forEach((file, index) => {
      fileMap[`video-${index}`] = file as IFile;
    });
  }

  const result = await CourseModuleVideoServices.createCourseModuleVideoIntoDB(
    payload,
    fileMap
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Videos created successfully",
    data: result,
  });
});

const getAllCourseModuleVideos = catchAsync(async (req, res) => {
  const result =
    await CourseModuleVideoServices.getAllCourseModuleVideosFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Course Module Videos retrieved successfully`,
    data: result,
  });
});

const getCourseModuleVideoById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseModuleVideoServices.getCourseModuleVideoByIdFromDB(
    id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Course Module Video retrieved successfully`,
    data: result,
  });
});

const updateCourseModuleVideo = catchAsync(async (req, res) => {
  const files = req.files as {
    thumbImage?: Express.Multer.File[];
    video?: Express.Multer.File[];
  };

  const { id } = req.params;

  const payload = req.body;

  const fileMap: Record<string, IFile> = {};

  if (files?.thumbImage?.length) {
    fileMap["thumbImage"] = files.thumbImage[0] as IFile;
  }

  if (files?.video?.length) {
    fileMap["video"] = files.video[0] as IFile;
  }

  const result = await CourseModuleVideoServices.updateCourseModuleVideoInDB(
    id as string,
    payload,
    fileMap
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course Module Video updated successfully",
    data: result,
  });
});

const deleteCourseModuleVideo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseModuleVideoServices.deleteCourseModuleVideoFromDB(
    id as string
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Course Module Video deleted successfully`,
    data: result,
  });
});
export const CourseModuleVideoControllers = {
  createCourseModuleVideo,
  getAllCourseModuleVideos,
  getCourseModuleVideoById,
  updateCourseModuleVideo,
  deleteCourseModuleVideo,
};
