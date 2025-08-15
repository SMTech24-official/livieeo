import { Education } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

const createEducationIntoDB = async (payload: Education) => {
    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    })
    if(!user){
        throw new ApiError(404,'User not found !')
    }
    const result = await prisma.education.create({
        data: payload
    })
    return result;
}

const updateEducationIntoDB = async (id: string, payload: Education) => {
    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    })
    if(!user){
        throw new ApiError(404,'User not found !')
    }
    const result = await prisma.education.update({
        where: { id },
        data: payload
    })
    return result;
}

const deleteEducationFromDB = async (id: string) => {
    const result = await prisma.education.delete({
        where: { id }
    })
    return result;
}

const getEducationByIdFromDB = async (id: string) => {
    const result = await prisma.education.findUnique({
        where: { id }
    })
    return result;
}

const getEducationsFromDB = async () => {
    
    const result = await prisma.education.findMany();
    if(result.length === 0){
        throw new ApiError(404,'Education not found !')
    }
    return result;
}

export const EducationServices = {
    createEducationIntoDB,
    updateEducationIntoDB,
    deleteEducationFromDB,
    getEducationByIdFromDB,
    getEducationsFromDB
};