import { Course, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IGenericResponse } from "../../../interfaces/common";
import QueryBuilder from "../../../helpers/queryBuilder";
import ApiError from "../../../errors/ApiError";
import httpStatus from 'http-status'
import { calcPercent, countTotals, sortCourseDeep } from "../../../helpers/progress";
import { JwtPayload } from "jsonwebtoken";




type VideoStatus = "locked" | "current" | "completed";

interface CourseDetailsView {
  id: string;
  courseTitle: string;
  mentorName: string;
  category: string;
  price: number;
  discountPrice: number;
  language: string;
  duration: string;
  description: string;
  purchased: boolean;
  percentCompleted: number;
  summary: {
    totalModules: number;
    completedModules: number;
    totalVideos: number;
    completedVideos: number;
  };
  modules: {
    id: string;
    moduleTitle: string;
    order: number;
    completed: boolean;
    videos: {
      id: string;
      videoTitle: string;
      fileUrl: string
      order: number;
      status: VideoStatus;
    }[];
  }[];
  certificate?: { certificateNo: string; certificateUrl: string } | null;
}



const createCourseIntoDB = async (payload: Course) => {
  const result = await prisma.course.create({
    data: payload
  });
  return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>): Promise<IGenericResponse<Course[]>> => {
  const queryBuilder = new QueryBuilder(prisma.course, query)
  const courses = await queryBuilder.range()
    .search(["category","courseTitle","mentorName"])
    .filter(["category"])
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




const getSingleCourseFromDB = async (
  courseId: string,
  userId?: string
): Promise<CourseDetailsView> => {
  const courseRaw = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      courseModules: { include: { courseModuleVideos: true }, orderBy: { order: "asc" } },
    },
  });
  if (!courseRaw) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

  const course = sortCourseDeep(courseRaw);
  const { totalModules, totalVideos } = countTotals(course);

  // ডিফল্ট: সব locked
  let purchased = false;
  let percentCompleted = 0;
  let completedModulesCount = 0;
  let completedVideosCount = 0;
  let currentVideoId: string | null = null;
  let completedSet = new Set<string>();
  let certInfo: CourseDetailsView["certificate"] = null;

  // যদি ইউজার দেয়া থাকে → progress আনবো
  let progress: any = null;
  if (userId) {
    progress = await prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    purchased = !!progress;

    if (progress) {
      completedSet = new Set(progress.completedVideos);
      percentCompleted = calcPercent(progress.completedVideos.length, totalVideos);

      // যদি currentVideoId null হয় (rare) → UX fallback (first video current দেখাই)
      currentVideoId = progress.currentVideoId ?? null;

      // সার্টিফিকেট থাকলে আনুন (শুধু সম্পন্ন হলে)
      if (progress.isCompleted) {
        const cert = await prisma.courseCertificate.findFirst({ where: { userId, courseId } });
        if (cert) certInfo = { certificateNo: cert.certificateNo, certificateUrl: cert.certificateUrl };
      }
    }
  }

  const modules = course.courseModules.map((m: any) => {
    const videos = m.courseModuleVideos.map((v: any) => {
      let status: VideoStatus = "locked";

      if (!purchased) {
        status = "locked";
      } else if (completedSet.has(v.id)) {
        status = "completed";
        completedVideosCount++;
      } else if (currentVideoId && v.id === currentVideoId) {
        status = "current";
      } else {
        status = "locked";
      }

      return { id: v.id, videoTitle: v.videoTitle,videoUrl:v.fileUrl, order: v.order, status };
    });

    const isModuleCompleted = m.courseModuleVideos.every((v: any) => completedSet.has(v.id));
    if (isModuleCompleted) completedModulesCount++;

    return {
      id: m.id,
      moduleTitle: m.moduleTitle,
      order: m.order,
      completed: isModuleCompleted,
      videos,
    };
  });

  return {
    id: course.id,
    courseTitle: course.courseTitle,
    mentorName: course.mentorName,
    category: course.category,
    price: course.price,
    discountPrice: course.discountPrice,
    language: course.language,
    duration: course.duration,
    description: course.description,
    purchased,
    percentCompleted,
    modules,
    summary: {
      totalModules,
      completedModules: completedModulesCount,
      totalVideos,
      completedVideos: completedVideosCount,
    },
    certificate: certInfo,
  };
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
const getRelatedCoursesFromDB = async (
  courseId: string,
  query: Record<string, unknown>
): Promise<IGenericResponse<Course[]>> => {
  // 1) প্রথমে main course বের করা
  const currentCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!currentCourse) {
    throw new ApiError(404, "Course not found");
  }

  // 2) QueryBuilder দিয়ে related courses আনবো
  const queryBuilder = new QueryBuilder(prisma.course, query);

  const courses = await queryBuilder
    .range()
    .search(["courseTitle", "mentorName", "category"])
    .filter(["category"])
    .sort()
    .paginate()
    .fields()
    .execute({
      where: {
        id: { not: courseId }, // নিজের course বাদ যাবে
        // { equals: currentCourse.category }
        category: currentCourse.category, // একই category এর course
        isPublished: true, // শুধু published course
      },
      include: {
        courseModules: {
          include: {
            courseModuleVideos: true,
          },
        },
        courseCertificate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const meta = await queryBuilder.countTotal();

  if (!courses || courses.length === 0) {
    throw new ApiError(404, "No related courses found");
  }

  return { meta, data: courses };
};
const updatePublishedStatus = async (courseId: string) => {
  // 1️⃣ Course আছে কিনা check করা
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    throw new ApiError(404, "Course not found!");
  }
  const result = await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: true },
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
  deleteCourseFromDB,
  getRelatedCoursesFromDB,
  getSingleCourseFromDB
}