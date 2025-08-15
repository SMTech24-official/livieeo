import { CourseModule } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

const createCourseModuleIntoDB = async(payload: CourseModule)=> {
    const course = await prisma.course.findUnique({
        where: {
            id: payload.courseId
        }
    })
    if(!course){
        throw new ApiError(404,"Course not found !")
    }
    const result = await prisma.courseModule.create({
        data: payload
    })
    return result;
}

const getAllCourseModulesFromDB = async() => {
    const result = await prisma.courseModule.findMany();
    return result;
}

const getCourseModuleByIdFromDB = async(id:string)=> {
    const result = await prisma.courseModule.findUniqueOrThrow({
        where: {
            id
        }
    })
    return result
}

export const CourseModuleServices = {
    createCourseModuleIntoDB,
    getAllCourseModulesFromDB,
    getCourseModuleByIdFromDB
}