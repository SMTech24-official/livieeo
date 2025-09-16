import { CourseModuleVideo } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../../errors/ApiError";

const createCourseModuleVideoIntoDB = async (
  payload: CourseModuleVideo[],
  files?: Record<string, IFile>
) => {
  const results = await Promise.all(
    payload.map(async (item, index) => {
      // 1) Check course module exists
      const courseModule = await prisma.courseModule.findUnique({
        where: { id: item.courseModuleId },
      });

      if (!courseModule) {
        throw new ApiError(404, "Course module not found !");
      }

      // 2) If id exists, check duplicate
      if (item.id) {
        const isExist = await prisma.courseModuleVideo.findFirst({
          where: { id: item.id },
        });
        if (isExist) return null;
      }

      // 3) Handle thumb upload (if exists)
      const thumbFile = files?.[`thumb-${index}`];
      if (thumbFile) {
        const uploadThumb = await fileUploader.uploadToCloudinary(thumbFile);
        item.thumbImage = uploadThumb?.secure_url ?? "";
      }

      // 4) Handle video upload (if exists)
      const videoFile = files?.[`video-${index}`];
      if (videoFile) {
        const uploadVideo = await fileUploader.uploadVideoToCloudinary(videoFile);
        item.fileUrl = uploadVideo?.secure_url ?? "";
      }

      // 5) Create video record
      return prisma.courseModuleVideo.create({ data: item });
    })
  );

  return results.filter((x): x is NonNullable<typeof x> => Boolean(x));
};

const getAllCourseModuleVideosFromDB = async () => {
    const result = await prisma.courseModuleVideo.findMany();
    return result;
}
const getCourseModuleVideoByIdFromDB = async (id: string) => {
    const result = await prisma.courseModuleVideo.findUnique({
        where: {
            id
        }
    });
    return result;
}
const updateCourseModuleVideoInDB = async (id: string, payload: CourseModuleVideo) => {
    const result = await prisma.courseModuleVideo.update({
        where: { id },
        data: payload
    });
    return result;
}
const deleteCourseModuleVideoFromDB = async (id: string) => {
    const result = await prisma.courseModuleVideo.delete({
        where: { id }
    });
    return result;
}
export const CourseModuleVideoServices = {
    createCourseModuleVideoIntoDB,
    getAllCourseModuleVideosFromDB,
    getCourseModuleVideoByIdFromDB,
    updateCourseModuleVideoInDB,
    deleteCourseModuleVideoFromDB
}