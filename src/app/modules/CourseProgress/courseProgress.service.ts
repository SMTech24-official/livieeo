// import ApiError from "../../../errors/ApiError";
// import prisma from "../../../shared/prisma";
// import httpStatus from "http-status";
// import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";

// // --------------------
// // Complete a video
// // --------------------


// export const completeVideo = async (userId: string, courseId: string, videoId: string) => {
//     if (!videoId) throw new ApiError(httpStatus.BAD_REQUEST, "Video ID is required");

//     const progress = await prisma.courseProgress.findFirst({ where: { userId, courseId } });
//     if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

//     const completedVideos = progress.completedVideos || [];

//     // Add video to completedVideos
//     if (!completedVideos.includes(videoId)) {
//         await prisma.courseProgress.update({
//             where: { id: progress.id },
//             data: { completedVideos: { push: videoId } },
//         });
//     }

//     // Find module that contains this video
//     const module = await prisma.courseModule.findFirst({
//         where: { courseId },
//         include: { courseModuleVideos: true },
//     });
//     if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module not found");

//     const allCompletedVideos = [...completedVideos, videoId];
//     const isModuleCompleted = module.courseModuleVideos.every(v => allCompletedVideos.includes(v.id));

//     if (isModuleCompleted) {
//         const completedModules = progress.completedModules || [];
//         if (!completedModules.includes(module.id)) {
//             await prisma.courseProgress.update({
//                 where: { id: progress.id },
//                 data: { completedModules: { push: module.id } },
//             });
//         }
//     }

//     // Unlock next video or module
//     const videoIndex = module.courseModuleVideos.findIndex(v => v.id === videoId);
//     const nextVideo = module.courseModuleVideos[videoIndex + 1];

//     if (nextVideo) {
//         await prisma.courseProgress.update({
//             where: { id: progress.id },
//             data: { currentVideoId: nextVideo.id },
//         });
//     } else {
//         const allModules = await prisma.courseModule.findMany({
//             where: { courseId },
//             include: { courseModuleVideos: true },
//             orderBy: { id: "asc" },
//         });
//         const nextModuleIndex = allModules.findIndex(m => m.id === module.id) + 1;
//         const nextModule = allModules[nextModuleIndex];

//         await prisma.courseProgress.update({
//             where: { id: progress.id },
//             data: {
//                 currentModuleId: nextModule?.id ?? null,
//                 currentVideoId: nextModule?.courseModuleVideos[0]?.id ?? null,
//                 isCompleted: nextModule ? false : true,
//             },
//         });

//         if (!nextModule) {
//             await CourseCertificateServices.createCourseCertificateIntoDB(
//                 { courseId } as any,
//                 { id: userId }
//             );
//         }
//     }

//     return await prisma.courseProgress.findUnique({ where: { id: progress.id } });
// };

// // --------------------
// // Get user progress
// // --------------------
// export const getProgress = async (userId: string, courseId: string) => {
//     return await prisma.courseProgress.findFirst({
//         where: { userId, courseId },
//         include: {
//             course: {
//                 include: {
//                     courseModules: {
//                         include: { courseModuleVideos: true },
//                         orderBy: { id: "asc" },
//                     },
//                 },
//             },
//         },
//     });
// };

// export const CourseProgressServices = {
//     completeVideo,
//     getProgress,
// };


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

/**
 * একটি ভিডিও complete
 * - কারেন্ট ভিডিও না হলে error (লকড)
 * - শেষ হলে পরের ভিডিও/মডিউল আনলক
 * - সব শেষ হলে isCompleted+certificate
 */
// export const completeVideo = async (userId: string, courseId: string, videoId: string) => {
//   if (!videoId) throw new ApiError(httpStatus.BAD_REQUEST, "Video ID is required");

//   const progress = await prisma.courseProgress.findUnique({
//     where: { userId_courseId: { userId, courseId } },
//   });
//   if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

//   // লক চেক: current ভিডিও-তেই টিক দেবার অনুমতি
//   if (progress.currentVideoId !== videoId) {
//     throw new ApiError(httpStatus.FORBIDDEN, "This video is locked. Complete previous video first.");
//   }

//   // কোর্স + অর্ডার সহ আনা
//   const course = await prisma.course.findUnique({
//     where: { id: courseId },
//     include: {
//       courseModules: {
//         include: { courseModuleVideos: true },
//         orderBy: { order: "asc" },
//       },
//     },
//   });
//   if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

//   // যে মডিউলে ভিডিও আছে সেটা বের করা
//   const modulesSorted = course.courseModules.map(m => ({
//     ...m,
//     courseModuleVideos: [...m.courseModuleVideos].sort((a, b) => a.order - b.order),
//   })).sort((a, b) => a.order - b.order);

//   const module = modulesSorted.find(m => m.courseModuleVideos.some(v => v.id === videoId));
//   if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module for this video not found");

//   const totalVideos = countTotalVideos({ courseModules: modulesSorted });

//   // ট্রানজ্যাকশন: push + next pointers + percent calc
//   const result = await prisma.$transaction(async (tx) => {
//     // 1) completedVideos-এ যোগ
//     const latest = await tx.courseProgress.update({
//       where: { id: progress.id },
//       data: {
//         completedVideos: progress.completedVideos.includes(videoId)
//           ? progress.completedVideos
//           : { push: videoId },
//         lastActivityAt: new Date(),
//       },
//     });

//     const newlyCompletedVideos = latest.completedVideos.includes(videoId)
//       ? latest.completedVideos
//       : [...latest.completedVideos, videoId];

//     // 2) মডিউল সম্পূর্ণ কিনা?
//     const isModuleCompleted = module.courseModuleVideos.every(v => newlyCompletedVideos.includes(v.id));

//     let completedModules = latest.completedModules;
//     if (isModuleCompleted && !completedModules.includes(module.id)) {
//       const updated = await tx.courseProgress.update({
//         where: { id: progress.id },
//         data: { completedModules: { push: module.id } },
//       });
//       completedModules = updated.completedModules;
//     }

//     // 3) পরের ভিডিও/মডিউল বের করা
//     const vids = module.courseModuleVideos;
//     const idx = vids.findIndex(v => v.id === videoId);
//     const nextInSameModule = idx >= 0 ? vids[idx + 1] : null;

//     let currentModuleId: string | null = latest.currentModuleId ?? null;
//     let currentVideoId: string | null = latest.currentVideoId ?? null;
//     let isCompleted = latest.isCompleted;
//     let completedAt: Date | null = latest.completedAt ?? null;

//     if (nextInSameModule) {
//       // একই মডিউলের পরের ভিডিও আনলক
//       currentModuleId = module.id;
//       currentVideoId = nextInSameModule.id;
//     } else {
//       // পরের মডিউল আছে?
//       const modIndex = modulesSorted.findIndex(m => m.id === module.id);
//       const nextModule = modulesSorted[modIndex + 1];
//       if (nextModule && nextModule.courseModuleVideos.length > 0) {
//         currentModuleId = nextModule.id;
//         currentVideoId = nextModule.courseModuleVideos[0]?.id ?? null;
//       } else {
//         // সব শেষ
//         currentModuleId = null;
//         currentVideoId = null;
//         isCompleted = true;
//         completedAt = new Date();
//       }
//     }

//     // 4) % ক্যালকুলেট
//     const completedCount = newlyCompletedVideos.length;
//     const percent = calcPercent(completedCount, totalVideos);

//     const final = await tx.courseProgress.update({
//       where: { id: progress.id },
//       data: {
//         currentModuleId,
//         currentVideoId,
//         isCompleted,
//         percentCompleted: percent,
//         completedAt,
//         lastActivityAt: new Date(),
//       },
//     });

//     // 5) কোর্স শেষ হলে সার্টিফিকেট
//     if (isCompleted) {
//       await CourseCertificateServices.createCourseCertificateIntoDB(
//         { courseId } as any,
//         { id: userId } as any
//       );
//     }

//     return final;
//   });

//   return result;
// };


// const completeVideo = async (
//   userId: string,
//   courseId: string,
//   videoId: string
// ) => {
//   if (!videoId)
//     throw new ApiError(httpStatus.BAD_REQUEST, "Video ID is required");

//   const progress = await prisma.courseProgress.findUnique({
//     where: { userId_courseId: { userId, courseId } },
//   });
//   if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

//   // Lock check
//   if (progress.currentVideoId !== videoId) {
//     throw new ApiError(
//       httpStatus.FORBIDDEN,
//       "This video is locked. Complete previous video first."
//     );
//   }

//   // Course + Modules
//   const course = await prisma.course.findUnique({
//     where: { id: courseId },
//     include: {
//       courseModules: {
//         include: { courseModuleVideos: true },
//         orderBy: { order: "asc" },
//       },
//     },
//   });
//   if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

//   // Module list safe sorting
//   const modulesSorted = course.courseModules
//     .map((m) => ({
//       ...m,
//       courseModuleVideos: [...(m.courseModuleVideos ?? [])].sort(
//         (a, b) => a.order - b.order
//       ),
//     }))
//     .sort((a, b) => a.order - b.order);

//   // Find module for this video
//   const module = modulesSorted.find((m) =>
//     (m.courseModuleVideos ?? []).some((v) => v.id === videoId)
//   );
//   if (!module)
//     throw new ApiError(httpStatus.NOT_FOUND, "Module for this video not found");

//   const totalVideos = countTotalVideos({ courseModules: modulesSorted });

//   // Transaction
//   const result = await prisma.$transaction(async (tx) => {
//     // 1) Add to completedVideos
//     const latest = await tx.courseProgress.update({
//       where: { id: progress.id },
//       data: {
//         completedVideos: progress.completedVideos.includes(videoId)
//           ? progress.completedVideos
//           : { push: videoId },
//         lastActivityAt: new Date(),
//       },
//     });

//     const newlyCompletedVideos = latest.completedVideos.includes(videoId)
//       ? latest.completedVideos
//       : [...latest.completedVideos, videoId];

//     // 2) Check if module completed
//     const isModuleCompleted = (module.courseModuleVideos ?? []).every((v) =>
//       newlyCompletedVideos.includes(v.id)
//     );

//     let completedModules = latest.completedModules;
//     if (isModuleCompleted && !completedModules.includes(module.id)) {
//       const updated = await tx.courseProgress.update({
//         where: { id: progress.id },
//         data: { completedModules: { push: module.id } },
//       });
//       completedModules = updated.completedModules;
//     }

//     // 3) Next video/module
//     const vids = module.courseModuleVideos ?? [];
//     const idx: number = vids.findIndex((v) => v.id === videoId);

//     let currentModuleId: string | null = latest.currentModuleId ?? null;
//     let currentVideoId: string | null = latest.currentVideoId ?? null;
//     let isCompleted = latest.isCompleted;
//     let completedAt: Date | null = latest.completedAt ?? null;

//     if (idx >= 0 && idx + 1 < vids.length) {
//       // same module next video
//       const nextInSameModule = vids[idx + 1];
//       currentModuleId = module.id;
//       currentVideoId = nextInSameModule?.id ?? null;
//     } else {
//       // next module?
//       const modIndex = modulesSorted.findIndex((m) => m.id === module.id);
//       const nextModule = modIndex >= 0 ? modulesSorted[modIndex + 1] : undefined;

//       if (nextModule && (nextModule.courseModuleVideos?.length ?? 0) > 0) {
//         currentModuleId = nextModule.id;
//         currentVideoId = nextModule.courseModuleVideos[0]?.id ?? null;
//       } else {
//         // সব শেষ
//         currentModuleId = null;
//         currentVideoId = null;
//         isCompleted = true;
//         completedAt = new Date();
//       }
//     }

//     // 4) Percent
//     const completedCount = newlyCompletedVideos.length;
//     const percent = calcPercent(completedCount, totalVideos);

//     const final = await tx.courseProgress.update({
//       where: { id: progress.id },
//       data: {
//         currentModuleId,
//         currentVideoId,
//         isCompleted,
//         percentCompleted: percent,
//         completedAt,
//         lastActivityAt: new Date(),
//       },
//     });

//     // 5) Certificate
//     if (isCompleted) {
//       await CourseCertificateServices.createCourseCertificateIntoDB(
//         { courseId } as any,
//         { id: userId } as any
//       );
//     }

//     return final;
//   });

//   return result;
// };


const completeVideo = async (userId: string, courseId: string, videoId: string) => {
  const progress = await prisma.courseProgress.findUnique({ where: { userId_courseId: { userId, courseId } } });
  if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

  if (progress.currentVideoId !== videoId) throw new ApiError(httpStatus.FORBIDDEN, "Complete previous video first");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { courseModules: { include: { courseModuleVideos: true }, orderBy: { order: "asc" } } }
  });
  if (!course) throw new ApiError(httpStatus.NOT_FOUND, "Course not found");

  const modulesSorted = course.courseModules.map(m => ({ ...m, courseModuleVideos: m.courseModuleVideos.sort((a, b) => a.order - b.order) })).sort((a, b) => a.order - b.order);
  const module = modulesSorted.find(m => m.courseModuleVideos.some(v => v.id === videoId));
  if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module not found");

  const newlyCompletedVideos = [...progress.completedVideos, videoId];
  const isModuleCompleted = module.courseModuleVideos.every(v => newlyCompletedVideos.includes(v.id));

  let completedModules = progress.completedModules;
  if (isModuleCompleted && !completedModules.includes(module.id)) completedModules = [...completedModules, module.id];

  const nextVideoIndex = module.courseModuleVideos.findIndex(v => v.id === videoId);
  const nextVideo = module.courseModuleVideos[nextVideoIndex + 1];

  let currentModuleId = progress.currentModuleId;
  let currentVideoId = nextVideo?.id ?? null;
  let isCompleted = false;
  let completedAt: Date | null = null;

  if (!nextVideo) {
    const moduleIndex = modulesSorted.findIndex(m => m.id === module.id);
    const nextModule = modulesSorted[moduleIndex + 1];
    if (nextModule) { currentModuleId = nextModule.id; currentVideoId = nextModule.courseModuleVideos[0]?.id ?? null; }
    else { currentModuleId = null; currentVideoId = null; isCompleted = true; completedAt = new Date(); }
  }

  const totalVideos = modulesSorted.reduce((sum, m) => sum + m.courseModuleVideos.length, 0);
  const percentCompleted = Math.round((newlyCompletedVideos.length / totalVideos) * 100);

  const updatedProgress = await prisma.courseProgress.update({
    where: { id: progress.id },
    data: { currentModuleId, currentVideoId, completedVideos: newlyCompletedVideos, completedModules, isCompleted, percentCompleted, completedAt, lastActivityAt: new Date() }
  });

  if (isCompleted) await CourseCertificateServices.createCourseCertificateIntoDB({ courseId } as any, { id: userId } as any);

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