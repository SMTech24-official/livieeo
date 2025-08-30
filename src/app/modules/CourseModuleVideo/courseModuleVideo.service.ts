import { CourseModuleVideo } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../../errors/ApiError";

const createCourseModuleVideoIntoDB = async (payload: CourseModuleVideo, file: IFile) => {
    const courseModule = await prisma.courseModule.findUnique({
        where: {
            id: payload.courseModuleId
        }
    })
    if(!courseModule){
        throw new ApiError(404,"Course module not found !")
    }
    const uploadToCloudinary = await fileUploader.uploadVideoToCloudinary(file);
    payload.fileUrl = uploadToCloudinary?.secure_url ?? "";
    const result = await prisma.courseModuleVideo.create({data: payload});
    return result
}
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