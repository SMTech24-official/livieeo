import { CourseModule } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCourseModuleIntoDB = async (payload: CourseModule[]) => {
  // payload হবে array of modules
  const result = await Promise.all(
    payload.map(async (item) => {
      // 1) Check if module already exists (if id is given)
      if (item.id) {
        const isExist = await prisma.courseModule.findFirst({
          where: { id: item.id },
        });
        if (isExist) {
          return null; // skip existing
        }
      }

      // 2) Create new course module
      const newModule = await prisma.courseModule.create({
        data: {
          moduleTitle: item.moduleTitle,
          courseId: item.courseId,
          order: item.order ?? 0, // optional ordering
        },
      });

      return newModule;
    })
  );

  return result.filter(Boolean); // remove null values
};


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