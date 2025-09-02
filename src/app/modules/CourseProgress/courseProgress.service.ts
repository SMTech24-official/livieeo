import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";

interface ProgressView {
  id: string;
  userId: string;
  courseId: string;
  currentModuleId: string | null;
  currentVideoId: string | null;
  isCompleted: boolean;
  percentCompleted: number;
  modules: {
    id: string;
    moduleTitle: string;
    order: number;
    completed: boolean;
    videos: {
      id: string;
      videoTitle: string;
      order: number;
      status: "locked" | "current" | "completed";
    }[];
  }[];
  certificate?: {
    certificateNo: string;
    certificateUrl: string;
  } | null;
  summary?: {
    totalModules: number;
    completedModules: number;
    totalVideos: number;
    completedVideos: number;
  };
}

// সহায়ক: মোট ভিডিও সংখ্যা গণনা
const countTotalVideos = (course: any) =>
  course.courseModules.reduce((sum: number, m: any) => sum + m.courseModuleVideos.length, 0);

// সহায়ক: % ক্যালকুলেট
const calcPercent = (completedCount: number, total: number) =>
  total === 0 ? 0 : Math.min(100, Math.round((completedCount / total) * 100));


export const completeVideo = async (userId: string, courseId: string, videoId: string) => {
  // 1) progress আনুন
  let progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

  // 2) course + ordered modules/videos আনুন
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      courseModules: {
        orderBy: { order: "asc" },
        include: {
          courseModuleVideos: { orderBy: { order: "asc" } },
        },
      },
    },
  });
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

  const modules = course.courseModules;
  const module = modules.find(m => m.courseModuleVideos.some(v => v.id === videoId));
  if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module not found");

  // 3) locked video চেক
  if (!progress.completedVideos.includes(videoId) && videoId !== progress.currentVideoId) {
    throw new ApiError(httpStatus.FORBIDDEN, "This video is locked. Please complete previous videos first.");
  }

  const totalVideos = modules.reduce((sum, m) => sum + m.courseModuleVideos.length, 0);
  let completedVideos = [...progress.completedVideos];
  let completedModules = [...progress.completedModules];
  let currentModuleId = progress.currentModuleId;
  let currentVideoId = progress.currentVideoId;
  let isCompleted = progress.isCompleted;
  let completedAt = progress.completedAt;

  const alreadyCompleted = completedVideos.includes(videoId);

  if (!alreadyCompleted) {
    completedVideos.push(videoId);

    const moduleDone = module.courseModuleVideos.every(v => completedVideos.includes(v.id));
    if (moduleDone && !completedModules.includes(module.id)) {
      completedModules.push(module.id);
    }

    const idx = module.courseModuleVideos.findIndex(v => v.id === videoId);
    const nextVideo = module.courseModuleVideos[idx + 1];

    if (nextVideo) {
      currentModuleId = module.id;
      currentVideoId = nextVideo.id;
    } else {
      const mIdx = modules.findIndex(m => m.id === module.id);
      const nextModule = modules[mIdx + 1] ?? null;

      if (nextModule && nextModule.courseModuleVideos.length > 0) {
        currentModuleId = nextModule.id;
        currentVideoId = nextModule.courseModuleVideos[0]?.id ?? null;
      } else {
        // সব শেষ
        currentModuleId = null;
        currentVideoId = null;
        isCompleted = true;
        completedAt = new Date();
      }
    }

    // progress update
    progress = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        completedVideos,
        completedModules,
        currentModuleId,
        currentVideoId,
        isCompleted,
        percentCompleted: calcPercent(completedVideos.length, totalVideos),
        completedAt,
        lastActivityAt: new Date(),
      },
    });
  }

  // 4) যদি কোর্স সম্পূর্ণ হয় → certificate generate
  let certificate = null;
  if (progress.isCompleted) {
    certificate = await CourseCertificateServices.createCourseCertificateIntoDB(
      { courseId } as any,
      { id: userId } as any
    );
  }

  // 5) UI-friendly modules view
  const modulesView = modules.map(m => {
    const videosView = m.courseModuleVideos.map(v => {
      let status: "locked" | "current" | "completed" = "locked";
      if (progress.completedVideos.includes(v.id)) status = "completed";
      else if (v.id === progress.currentVideoId) status = "current";
      return { id: v.id, videoTitle: v.videoTitle, order: v.order, status };
    });
    return {
      id: m.id,
      moduleTitle: m.moduleTitle,
      order: m.order,
      completed: progress.completedModules.includes(m.id),
      videos: videosView,
    };
  });

  return {
    id: progress.id,
    userId,
    courseId,
    currentModuleId: progress.currentModuleId,
    currentVideoId: progress.currentVideoId,
    isCompleted: progress.isCompleted,
    percentCompleted: progress.percentCompleted,
    modules: modulesView,
    certificate: certificate
      ? { certificateNo: certificate.certificateNo, certificateUrl: certificate.certificateUrl }
      : null,
  };
};




/** প্রগ্রেস রিড (UI-friendly) */
const getProgress = async (userId: string, courseId: string): Promise<ProgressView | null> => {
  const [progress, course, certificate] = await Promise.all([
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
    prisma.courseCertificate.findFirst({
      where: { userId, courseId },
    }),
  ]);

  if (!progress || !course) return null;

  const modulesSorted = course.courseModules
    .map(m => ({
      ...m,
      courseModuleVideos: [...m.courseModuleVideos].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);

  const completedSet = new Set(progress.completedVideos);

  let totalModules = modulesSorted.length;
  let completedModulesCount = 0;
  let totalVideos = 0;
  let completedVideosCount = 0;

  const modules = modulesSorted.map(m => {
    const isModuleCompleted = m.courseModuleVideos.every(v => completedSet.has(v.id));
    if (isModuleCompleted) completedModulesCount++;

    const videos = m.courseModuleVideos.map(v => {
      const isCompleted = completedSet.has(v.id);
      if (isCompleted) completedVideosCount++;
      totalVideos++;
      const status: "completed" | "current" | "locked" = isCompleted
        ? "completed"
        : v.id === progress.currentVideoId
        ? "current"
        : "locked";
      return {
        id: v.id,
        videoTitle: v.videoTitle,
        order: v.order,
        status,
      };
    });

    return {
      id: m.id,
      moduleTitle: m.moduleTitle,
      order: m.order,
      completed: isModuleCompleted,
      videos,
    };
  });

  const percent = calcPercent(progress.completedVideos.length, totalVideos);

  const certInfo = progress.isCompleted && certificate
    ? { certificateNo: certificate.certificateNo, certificateUrl: certificate.certificateUrl }
    : null;

  return {
    id: progress.id,
    userId,
    courseId,
    currentModuleId: progress.currentModuleId ?? null,
    currentVideoId: progress.currentVideoId ?? null,
    isCompleted: progress.isCompleted,
    percentCompleted: percent,
    modules,
    certificate: certInfo,
    summary: { // ✅ নতুন field
      totalModules,
      completedModules: completedModulesCount,
      totalVideos,
      completedVideos: completedVideosCount,
    },
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