import { CourseModule, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

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

const updateCourseModuleIntoDB = async (
  moduleId: string,
  payload: CourseModule
) => {
  // 1️⃣ Course আছে কিনা check করা
  const existingCourse = await prisma.courseModule.findUnique({
    where: { id: moduleId },
  });

  if (!existingCourse) {
    throw new ApiError(404, "Module not found!");
  }

  // 2️⃣ শুধু valid field গুলো পাঠানো (undefined বাদ দিয়ে)
  const updateData: Record<string, any> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key] = value;
    }
  });

  // 3️⃣ এখন update করা
  const result = await prisma.courseModule.update({
    where: { id: moduleId },
    data: updateData,
  });

  return result;
};

const deleteCourseModuleFromDB = async (id: string) => {
  const module = await prisma.courseModule.findUnique({
    where: { id },
    include: { courseModuleVideos: true },
  });

  if (!module) {
    throw new ApiError(404, "Course Module not found!");
  }

  // 2️⃣ CourseModule → CourseModuleVideo delete
  if (module.courseModuleVideos.length > 0) {
    await prisma.courseModuleVideo.deleteMany({
      where: { courseModuleId: module.id },
    });
  }

  await prisma.courseModule.delete({
    where: { id },
  });

  return { message: "Course and all associated data deleted successfully" };
};

const getAllCourseModulesFromDB = async () => {
  const result = await prisma.courseModule.findMany();
  return result;
};

const getCourseModuleByIdFromDB = async (id: string) => {
  const result = await prisma.courseModule.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

export const CourseModuleServices = {
  createCourseModuleIntoDB,
  updateCourseModuleIntoDB,
  deleteCourseModuleFromDB,
  getAllCourseModulesFromDB,
  getCourseModuleByIdFromDB,
};
