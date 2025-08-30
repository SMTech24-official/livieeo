import { Course, Prisma } from "@prisma/client";
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
    .search(["courseTitle","mentorName"])
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
const getPublishedCoursesFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Course[]>> => {
  const queryBuilder = new QueryBuilder(prisma.course, query)
  const courses = await queryBuilder.range()
    .search(["courseTitle"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute({
      where: {
        isPublished: true
      },
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
  // 1️⃣ Course আছে কিনা check করা
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    throw new ApiError(404, "Course not found!");
  }
  const result = await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: status },
  });
  return result;
}
const updateCourseIntoDB = async (courseId: string, payload: Prisma.CourseUpdateInput) => {
  // 1️⃣ Course আছে কিনা check করা
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    throw new ApiError(404, "Course not found!");
  }

  // 2️⃣ শুধু valid field গুলো পাঠানো (undefined বাদ দিয়ে)
  const updateData: Record<string, any> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key] = value;
    }
  });

  // 3️⃣ এখন update করা
  const result = await prisma.course.update({
    where: { id: courseId },
    data: updateData,
  });

  return result;
};

const deleteCourseFromDB = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Course আছে কিনা check করো
    const course = await tx.course.findUnique({
      where: { id },
      include: {
        courseModules: {
          include: { courseModuleVideos: true },
        },
        courseCertificate: true,
        orderCourseItem: true,
        orderCourse: true,
      },
    });

    if (!course) {
      throw new ApiError(404, "Course not found!");
    }

    // 2️⃣ CourseModule → CourseModuleVideo delete
    for (const module of course.courseModules) {
      if (module.courseModuleVideos.length > 0) {
        await tx.courseModuleVideo.deleteMany({
          where: { courseModuleId: module.id },
        });
      }
    }

    if (course.courseModules.length > 0) {
      await tx.courseModule.deleteMany({
        where: { courseId: id },
      });
    }

    // 3️⃣ CourseCertificate delete
    if (course.courseCertificate.length > 0) {
      await tx.courseCertificate.deleteMany({
        where: { courseId: id },
      });
    }

    // 4️⃣ OrderCourseItem delete
    if (course.orderCourseItem.length > 0) {
      await tx.orderCourseItem.deleteMany({
        where: { courseId: id },
      });
    }

    // 5️⃣ OrderCourse delete (যদি courseId সেট করা থাকে)
    if (course.orderCourse.length > 0) {
      await tx.orderCourse.deleteMany({
        where: { courseId: id },
      });
    }

    // 6️⃣ সব dependency delete হওয়ার পর মূল course delete
    await tx.course.delete({
      where: { id },
    });

    return { message: "Course and all associated data deleted successfully" };
  });
};


export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updatePublishedStatus,
  updateCourseIntoDB,
  getPublishedCoursesFromDB,
  deleteCourseFromDB
}