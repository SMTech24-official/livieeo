import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";
import {
  calcPercent,
  countTotals,
  sortCourseDeep,
} from "../../../helpers/progress";

const completeVideo = async (
  userId: string,
  courseId: string,
  videoId: string
) => {
  // progress
  let progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

  // course + sort
  const courseRaw = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      courseModules: {
        orderBy: { order: "asc" },
        include: { courseModuleVideos: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!courseRaw) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");
  const course = sortCourseDeep(courseRaw);
  const modules = course.courseModules;

  console.log(JSON.stringify(course, undefined, 2));

  // যে module এ এই ভিডিও আছে
  const module = modules.find((m: any) =>
    m.courseModuleVideos.some((v: any) => v.id === videoId)
  );
  if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module not found");

  // Find the next video from module, as new videos are not added in the progress.currentVideoId
  const videos = module.courseModuleVideos;
  const lastCompleted = progress?.completedVideos?.at(-1);

  const lastIndex = videos.findIndex((v: any) => v.id === lastCompleted);

  let nextVideo: any = null;

  if (lastIndex >= 0 && lastIndex < videos.length - 1) {
    nextVideo = videos[lastIndex + 1];
  }

  // লকড ভিডিও কিনা?
  if (
    !progress.completedVideos.includes(videoId) &&
    videoId !== progress.currentVideoId &&
    videoId !== nextVideo.id
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "This video is locked. Please complete previous videos first."
    );
  }

  // progress update build
  const { totalVideos } = countTotals(course);
  let completedVideos = [...progress.completedVideos];
  let completedModules = [...progress.completedModules];
  let currentModuleId = progress.currentModuleId;
  let currentVideoId = progress.currentVideoId;
  let isCompleted = progress.isCompleted;
  let completedAt = progress.completedAt;

  const alreadyCompleted = completedVideos.includes(videoId);

  if (!alreadyCompleted) {
    completedVideos.push(videoId);

    // module done?
    const moduleDone = module.courseModuleVideos.every((v: any) =>
      completedVideos.includes(v.id)
    );
    if (moduleDone && !completedModules.includes(module.id)) {
      completedModules.push(module.id);
    }

    // পরের ভিডিও
    const idx = module.courseModuleVideos.findIndex(
      (v: any) => v.id === videoId
    );
    const nextVideo = module.courseModuleVideos[idx + 1];

    if (nextVideo) {
      currentModuleId = module.id;
      currentVideoId = nextVideo.id;
    } else {
      // পরের মডিউল
      const mIdx = modules.findIndex((m: any) => m.id === module.id);
      const nextModule = modules[mIdx + 1] ?? null;

      if (nextModule && nextModule.courseModuleVideos.length > 0) {
        currentModuleId = nextModule.id;
        currentVideoId = nextModule.courseModuleVideos[0].id;
      } else {
        // শেষ
        currentModuleId = null;
        currentVideoId = null;
        isCompleted = true;
        completedAt = new Date();
      }
    }

    // update
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

  // সার্টিফিকেট (একবারই তৈরি হবে)
  let certDoc = null;
  if (progress.isCompleted) {
    certDoc = await prisma.courseCertificate.findFirst({
      where: { userId, courseId },
    });
    if (!certDoc) {
      certDoc = await CourseCertificateServices.createCourseCertificateIntoDB(
        { courseId } as any,
        { id: userId } as any
      );
    }
  }

  // UI view
  const modulesView = course.courseModules.map((m: any) => {
    const videosView = m.courseModuleVideos.map((v: any) => {
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
    certificate: certDoc
      ? {
          certificateNo: certDoc.certificateNo,
          certificateUrl: certDoc.certificateUrl,
        }
      : null,
  };
};

export const CourseProgressServices = {
  completeVideo,
};
