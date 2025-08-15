import { CourseCertificate } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import ApiError from "../../../errors/ApiError";

const createCourseCertificateIntoDB = async (payload: CourseCertificate, file: IFile) => {
    const course = await prisma.course.findUnique({
        where: {
            id: payload.courseId
        }
    })
    if(!course){
        throw new ApiError(404,"Course not found !")
    }
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    payload.certificateUrl = uploadToCloudinary?.secure_url ?? ""
    const result = await prisma.courseCertificate.create({
        data: payload
    })
    return result;
}

const getAllCourseCertificatesFromDB = async ()=> {
    const result = await prisma.courseCertificate.findMany();
    return result;
}

export const CourseCertificateServices = {
    createCourseCertificateIntoDB,
    getAllCourseCertificatesFromDB
};