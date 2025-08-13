import { Course } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createCourseIntoDB = async (payload: Course) => {
    const result = await prisma.course.create({
        data: payload
    });
    return result;
}

const getAllCoursesFromDB = async () => {
  const result = await prisma.course.findMany({
    include: {
      courseModules: {
        include: {
          courseModuleVideos: true, // প্রতিটি module এর videos
        },
      },
      courseCertificate: true, // প্রতিটি course এর certificate
    },
  });

  return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB
}