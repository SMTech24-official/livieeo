"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseProgressServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const courseCertificate_service_1 = require("../CourseCertificate/courseCertificate.service");
const progress_1 = require("../../../helpers/progress");
const completeVideo = async (userId, courseId, videoId) => {
    // progress
    let progress = await prisma_1.default.courseProgress.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
    if (!progress)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Progress not found");
    // course + sort
    const courseRaw = await prisma_1.default.course.findUnique({
        where: { id: courseId },
        include: {
            courseModules: {
                orderBy: { order: "asc" },
                include: { courseModuleVideos: { orderBy: { order: "asc" } } },
            },
        },
    });
    if (!courseRaw)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course not found");
    const course = (0, progress_1.sortCourseDeep)(courseRaw);
    const modules = course.courseModules;
    // যে module এ এই ভিডিও আছে
    const module = modules.find((m) => m.courseModuleVideos.some((v) => v.id === videoId));
    if (!module)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Module not found");
    // লকড ভিডিও কিনা?
    if (!progress.completedVideos.includes(videoId) && videoId !== progress.currentVideoId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "This video is locked. Please complete previous videos first.");
    }
    // progress update build
    const { totalVideos } = (0, progress_1.countTotals)(course);
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
        const moduleDone = module.courseModuleVideos.every((v) => completedVideos.includes(v.id));
        if (moduleDone && !completedModules.includes(module.id)) {
            completedModules.push(module.id);
        }
        // পরের ভিডিও
        const idx = module.courseModuleVideos.findIndex((v) => v.id === videoId);
        const nextVideo = module.courseModuleVideos[idx + 1];
        if (nextVideo) {
            currentModuleId = module.id;
            currentVideoId = nextVideo.id;
        }
        else {
            // পরের মডিউল
            const mIdx = modules.findIndex((m) => m.id === module.id);
            const nextModule = modules[mIdx + 1] ?? null;
            if (nextModule && nextModule.courseModuleVideos.length > 0) {
                currentModuleId = nextModule.id;
                currentVideoId = nextModule.courseModuleVideos[0].id;
            }
            else {
                // শেষ
                currentModuleId = null;
                currentVideoId = null;
                isCompleted = true;
                completedAt = new Date();
            }
        }
        // update
        progress = await prisma_1.default.courseProgress.update({
            where: { id: progress.id },
            data: {
                completedVideos,
                completedModules,
                currentModuleId,
                currentVideoId,
                isCompleted,
                percentCompleted: (0, progress_1.calcPercent)(completedVideos.length, totalVideos),
                completedAt,
                lastActivityAt: new Date(),
            },
        });
    }
    // সার্টিফিকেট (একবারই তৈরি হবে)
    let certDoc = null;
    if (progress.isCompleted) {
        certDoc = await prisma_1.default.courseCertificate.findFirst({ where: { userId, courseId } });
        if (!certDoc) {
            certDoc = await courseCertificate_service_1.CourseCertificateServices.createCourseCertificateIntoDB({ courseId }, { id: userId });
        }
    }
    // UI view
    const modulesView = course.courseModules.map((m) => {
        const videosView = m.courseModuleVideos.map((v) => {
            let status = "locked";
            if (progress.completedVideos.includes(v.id))
                status = "completed";
            else if (v.id === progress.currentVideoId)
                status = "current";
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
            ? { certificateNo: certDoc.certificateNo, certificateUrl: certDoc.certificateUrl }
            : null,
    };
};
exports.CourseProgressServices = {
    completeVideo
};
//# sourceMappingURL=courseProgress.service.js.map