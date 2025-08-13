import { CourseCertificate } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";

const createCourseCertificateIntoDB = async (payload: CourseCertificate, file: IFile) => {
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