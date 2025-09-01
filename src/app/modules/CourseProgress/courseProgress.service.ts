import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";

type ProgressView = {
  id: string;
  userId: string;
  courseId: string;
  currentModuleId: string | null;
  currentVideoId: string | null;
  isCompleted: boolean;
  percentCompleted: number;
  modules: Array<{
    id: string;
    moduleTitle: string;
    order: number;
    completed: boolean;
    videos: Array<{
      id: string;
      videoTitle: string;
      order: number;
      status: "locked" | "current" | "completed";
    }>;
  }>;
};

// সহায়ক: মোট ভিডিও সংখ্যা গণনা
const countTotalVideos = (course: any) =>
  course.courseModules.reduce((sum: number, m: any) => sum + m.courseModuleVideos.length, 0);

// সহায়ক: % ক্যালকুলেট
const calcPercent = (completedCount: number, total: number) =>
  total === 0 ? 0 : Math.min(100, Math.round((completedCount / total) * 100));


const completeVideo = async (userId: string, courseId: string, videoId: string) => {
  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

  // ✅ If already completed, just return progress (no error)
  if (progress.completedVideos.includes(videoId)) {
    return progress;
  }

  // ✅ Only restrict if user tries to complete a video ahead of current
  if (progress.currentVideoId !== videoId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Complete previous video first");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      courseModules: {
        include: { courseModuleVideos: true },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

  const modulesSorted = course.courseModules
    .map((m) => ({
      ...m,
      courseModuleVideos: m.courseModuleVideos.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);

  const module = modulesSorted.find((m) =>
    m.courseModuleVideos.some((v) => v.id === videoId)
  );
  if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module not found");

  const newlyCompletedVideos = [...progress.completedVideos, videoId];
  const isModuleCompleted = module.courseModuleVideos.every((v) =>
    newlyCompletedVideos.includes(v.id)
  );

  let completedModules = progress.completedModules;
  if (isModuleCompleted && !completedModules.includes(module.id)) {
    completedModules = [...completedModules, module.id];
  }

  const nextVideoIndex = module.courseModuleVideos.findIndex(
    (v) => v.id === videoId
  );
  const nextVideo = module.courseModuleVideos[nextVideoIndex + 1];

  let currentModuleId = progress.currentModuleId;
  let currentVideoId = nextVideo?.id ?? null;
  let isCompleted = false;
  let completedAt: Date | null = null;

  if (!nextVideo) {
    const moduleIndex = modulesSorted.findIndex((m) => m.id === module.id);
    const nextModule = modulesSorted[moduleIndex + 1];
    if (nextModule) {
      currentModuleId = nextModule.id;
      currentVideoId = nextModule.courseModuleVideos[0]?.id ?? null;
    } else {
      currentModuleId = null;
      currentVideoId = null;
      isCompleted = true;
      completedAt = new Date();
    }
  }

  const totalVideos = modulesSorted.reduce(
    (sum, m) => sum + m.courseModuleVideos.length,
    0
  );
  const percentCompleted = Math.round(
    (newlyCompletedVideos.length / totalVideos) * 100
  );

  const updatedProgress = await prisma.courseProgress.update({
    where: { id: progress.id },
    data: {
      currentModuleId,
      currentVideoId,
      completedVideos: newlyCompletedVideos,
      completedModules,
      isCompleted,
      percentCompleted,
      completedAt,
      lastActivityAt: new Date(),
    },
  });

  if (isCompleted)
    await CourseCertificateServices.createCourseCertificateIntoDB(
      { courseId } as any,
      { id: userId } as any
    );

  return updatedProgress;
};


/** প্রগ্রেস রিড (UI-friendly) */
export const getProgress = async (userId: string, courseId: string): Promise<ProgressView | null> => {
  const [progress, course] = await Promise.all([
    prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    }),
    prisma.course.findUnique({
      where: { id: courseId },
      include: {
        courseModules: {
          include: { courseModuleVideos: true },
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);

  if (!progress || !course) return null;

  const modulesSorted = course.courseModules.map(m => ({
    ...m,
    courseModuleVideos: [...m.courseModuleVideos].sort((a, b) => a.order - b.order),
  })).sort((a, b) => a.order - b.order);

  const totalVideos = countTotalVideos({ courseModules: modulesSorted });
  const completedSet = new Set(progress.completedVideos);

  // ভিডিও স্ট্যাটাস ম্যাপ করা: completed | current | locked
  const modules = modulesSorted.map(m => {
    const isModCompleted = m.courseModuleVideos.every(v => completedSet.has(v.id));
    const videos = m.courseModuleVideos.map(v => {
      let status: "locked" | "current" | "completed" = "locked";
      if (completedSet.has(v.id)) status = "completed";
      else if (progress.currentVideoId === v.id) status = "current";
      return { id: v.id, videoTitle: v.videoTitle, order: v.order, status };
    });
    return {
      id: m.id,
      moduleTitle: m.moduleTitle,
      order: m.order,
      completed: isModCompleted,
      videos,
    };
  });

  const percent = calcPercent(progress.completedVideos.length, totalVideos);

  return {
    id: progress.id,
    userId,
    courseId,
    currentModuleId: progress.currentModuleId ?? null,
    currentVideoId: progress.currentVideoId ?? null,
    isCompleted: progress.isCompleted,
    percentCompleted: percent,
    modules,
  };
};

/** “Course Complete” বাটন: সব দেখা শেষ না হলে error, নাহলে complete+certificate */
export const completeCourseManually = async (userId: string, courseId: string) => {
  const progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

  if (progress.isCompleted) return progress;

  // কোর্সের মোট ভিডিও
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { courseModules: { include: { courseModuleVideos: true } } },
  });
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

  const totalVideos = countTotalVideos(course);
  const completedCount = (progress.completedVideos || []).length;

  if (completedCount < totalVideos) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You still have ${totalVideos - completedCount} video(s) remaining.`
    );
  }

  const final = await prisma.courseProgress.update({
    where: { id: progress.id },
    data: {
      isCompleted: true,
      percentCompleted: 100,
      currentModuleId: null,
      currentVideoId: null,
      completedAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  await CourseCertificateServices.createCourseCertificateIntoDB(
    { courseId } as any,
    { id: userId } as any
  );

  return final;
};

export const CourseProgressServices = {
  completeVideo,
  getProgress,
  completeCourseManually,
};