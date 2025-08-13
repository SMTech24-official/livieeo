import { CourseModule } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCourseModuleIntoDB = async(payload: CourseModule)=> {
    const result = await prisma.courseModule.create({
        data: payload
    })
    return result;
}

const getAllCourseModulesFromDB = async() => {
    const result = await prisma.courseModule.findMany();
    return result;
}

export const CourseModuleServices = {
    createCourseModuleIntoDB,
    getAllCourseModulesFromDB
}