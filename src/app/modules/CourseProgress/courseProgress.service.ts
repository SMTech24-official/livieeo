// import ApiError from "../../../errors/ApiError";
// import prisma from "../../../shared/prisma";
// import httpStatus from "http-status";
// import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";

// // --------------------
// // Complete a video
// // --------------------
// const completeVideo = async (userId: string, courseId: string, videoId: string) => {
//     const progress = await prisma.courseProgress.findFirst({ where: { userId, courseId } });
//     if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

//     // Add video to completedVideos if not already
//     if (!progress.completedVideos.includes(videoId)) {
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

//     // Module complete check
//     const allCompletedVideos = [...progress.completedVideos, videoId];
//     const isModuleCompleted = module.courseModuleVideos.every(v => allCompletedVideos.includes(v.id));

//     if (isModuleCompleted && !progress.completedModules.includes(module.id)) {
//         await prisma.courseProgress.update({
//             where: { id: progress.id },
//             data: { completedModules: { push: module.id } },
//         });
//     }

//     // Unlock next video
//     const videoIndex = module.courseModuleVideos.findIndex(v => v.id === videoId);
//     const nextVideo = module.courseModuleVideos[videoIndex + 1];

//     if (nextVideo) {
//         await prisma.courseProgress.update({
//             where: { id: progress.id },
//             data: { currentVideoId: nextVideo.id },
//         });
//     } else {
//         // Unlock next module
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
//                 isCompleted: nextModule ? false : true, // If no next module, course completed
//             },
//         });

//         // Generate certificate if course completed
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
//     getProgress
// }




import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";

// --------------------
// Complete a video
// --------------------
export const completeVideo = async (userId: string, courseId: string, videoId: string) => {
    const progress = await prisma.courseProgress.findFirst({ where: { userId, courseId } });
    if (!progress) throw new ApiError(httpStatus.NOT_FOUND, "Progress not found");

    // Add video to completedVideos
    if (!progress.completedVideos.includes(videoId)) {
        await prisma.courseProgress.update({
            where: { id: progress.id },
            data: { completedVideos: { push: videoId } },
        });
    }

    // Find module containing this video
    const module = await prisma.courseModule.findFirst({
        where: { courseId, courseModuleVideos: { some: { id: videoId } } },
        include: { courseModuleVideos: true },
        orderBy: { id: "asc" },
    });
    if (!module) throw new ApiError(httpStatus.NOT_FOUND, "Module not found");

    // Check module completion
    const allCompletedVideos = [...progress.completedVideos, videoId];
    const isModuleCompleted = module.courseModuleVideos.every(v => allCompletedVideos.includes(v.id));

    if (isModuleCompleted && !progress.completedModules.includes(module.id)) {
        await prisma.courseProgress.update({
            where: { id: progress.id },
            data: { completedModules: { push: module.id } },
        });
    }

    // Unlock next video
    const videoIndex = module.courseModuleVideos.findIndex(v => v.id === videoId);
    const nextVideo = module.courseModuleVideos[videoIndex + 1];

    if (nextVideo) {
        await prisma.courseProgress.update({
            where: { id: progress.id },
            data: { currentVideoId: nextVideo.id },
        });
    } else {
        // Unlock next module
        const allModules = await prisma.courseModule.findMany({
            where: { courseId },
            include: { courseModuleVideos: true },
            orderBy: { id: "asc" },
        });

        const nextModuleIndex = allModules.findIndex(m => m.id === module.id) + 1;
        const nextModule = allModules[nextModuleIndex];

        await prisma.courseProgress.update({
            where: { id: progress.id },
            data: {
                currentModuleId: nextModule?.id ?? null,
                currentVideoId: nextModule?.courseModuleVideos[0]?.id ?? null,
                isCompleted: nextModule ? false : true,
            },
        });

        // Generate certificate if course completed
        if (!nextModule) {
            await CourseCertificateServices.createCourseCertificateIntoDB(
                { courseId } as any,
                { id: userId }
            );
        }
    }

    return await prisma.courseProgress.findUnique({ where: { id: progress.id } });
};

// --------------------
// Get user progress
// --------------------
export const getProgress = async (userId: string, courseId: string) => {
    return await prisma.courseProgress.findFirst({
        where: { userId, courseId },
        include: {
            course: {
                include: {
                    courseModules: {
                        include: { courseModuleVideos: true },
                        orderBy: { id: "asc" },
                    },
                },
            },
        },
    });
};

export const CourseProgressServices = {
    completeVideo,
    getProgress,
};
