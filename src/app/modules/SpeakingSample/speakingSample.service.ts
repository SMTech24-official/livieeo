import { SpeakingSample } from "@prisma/client";
import { IFile } from "../../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const createSpeakingSampleIntoDB = async (payload: SpeakingSample, file: IFile) => {
    const uploadToCloudinary = await fileUploader.uploadVideoToCloudinary(file);
    payload.featureMedia = uploadToCloudinary?.secure_url ?? "";
    const result = await prisma.speakingSample.create({data:payload})
    return result
}


export const SpeakingSampleServices = {
    createSpeakingSampleIntoDB
}