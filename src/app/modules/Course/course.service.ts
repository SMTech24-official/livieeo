import { Course } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import ApiError from "../../../errors/ApiError";

const createCourseIntoDB = async (payload: Course) => {
  const result = await prisma.course.create({
    data: payload
  });
  return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Course[]>> => {
  const queryBuilder = new QueryBuilder(prisma.course, query)
  const courses = await queryBuilder.range()
    .search(["courseTitle"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute({
      include: {
        courseModules: {
          include: {
            courseModuleVideos: true, // প্রতিটি module এর videos
          },
        },
        courseCertificate: true, // প্রতিটি course এর certificate
      },
    });
  const meta = await queryBuilder.countTotal();
  if (!courses || courses.length === 0) {
    throw new ApiError(404, "No courses found");
  }

  return { meta, data: courses }
};

const updatePublishedStatus = async (courseId: string, status: boolean) => {
  const result = await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: status },
  });
  return result;
}

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updatePublishedStatus,
}