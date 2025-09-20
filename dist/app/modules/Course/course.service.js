"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const progress_1 = require("../../../helpers/progress");
const fileUploader_1 = require("../../../helpers/fileUploader");
const createCourseIntoDB = async (payload, file) => {
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.thumbImage = uploadToCloudinary?.secure_url ?? "";
    }
    const result = await prisma_1.default.course.create({
        data: payload
    });
    return result;
};
const getAllCoursesFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.course, query);
    const courses = await queryBuilder.range()
        .search(["category", "courseTitle", "mentorName"])
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
        throw new ApiError_1.default(404, "No courses found");
    }
    return { meta, data: courses };
};
const getSingleCourseFromDB = async (courseId, userId) => {
    const courseRaw = await prisma_1.default.course.findUnique({
        where: { id: courseId },
        include: {
            courseModules: { include: { courseModuleVideos: true }, orderBy: { order: "asc" } },
        },
    });
    if (!courseRaw)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course not found");
    const course = (0, progress_1.sortCourseDeep)(courseRaw);
    const { totalModules, totalVideos } = (0, progress_1.countTotals)(course);
    let purchased = false;
    let percentCompleted = 0;
    let completedModulesCount = 0;
    let completedVideosCount = 0;
    let currentVideoId = null;
    let completedSet = new Set();
    let certInfo = null;
    let progress = null;
    if (userId) {
        progress = await prisma_1.default.courseProgress.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        purchased = !!progress;
        if (progress) {
            completedSet = new Set(progress.completedVideos);
            percentCompleted = (0, progress_1.calcPercent)(progress.completedVideos.length, totalVideos);
            currentVideoId = progress.currentVideoId ?? null;
            if (progress.isCompleted) {
                const cert = await prisma_1.default.courseCertificate.findFirst({ where: { userId, courseId } });
                if (cert)
                    certInfo = { certificateNo: cert.certificateNo, certificateUrl: cert.certificateUrl };
            }
        }
    }
    const modules = course.courseModules.map((m) => {
        const videos = m.courseModuleVideos.map((v) => {
            let status = "locked";
            if (!purchased) {
                status = "locked";
            }
            else if (completedSet.has(v.id)) {
                status = "completed";
                completedVideosCount++;
            }
            else if (currentVideoId && v.id === currentVideoId) {
                status = "current";
            }
            else {
                status = "locked";
            }
            return { id: v.id, videoTitle: v.videoTitle, videoUrl: v.fileUrl, order: v.order, status };
        });
        const isModuleCompleted = m.courseModuleVideos.every((v) => completedSet.has(v.id));
        if (isModuleCompleted)
            completedModulesCount++;
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
const getPublishedCoursesFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.course, query);
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
        throw new ApiError_1.default(404, "No courses found");
    }
    return { meta, data: courses };
};
const getRelatedCoursesFromDB = async (courseId, query) => {
    // 1) প্রথমে main course বের করা
    const currentCourse = await prisma_1.default.course.findUnique({
        where: { id: courseId },
    });
    if (!currentCourse) {
        throw new ApiError_1.default(404, "Course not found");
    }
    // 2) QueryBuilder দিয়ে related courses আনবো
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.course, query);
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
        throw new ApiError_1.default(404, "No related courses found");
    }
    return { meta, data: courses };
};
const updatePublishedStatus = async (courseId) => {
    // 1️⃣ Course আছে কিনা check করা
    const existingCourse = await prisma_1.default.course.findUnique({
        where: { id: courseId },
    });
    if (!existingCourse) {
        throw new ApiError_1.default(404, "Course not found!");
    }
    const result = await prisma_1.default.course.update({
        where: { id: courseId },
        data: { isPublished: true },
    });
    return result;
};
const updateCourseIntoDB = async (courseId, payload) => {
    // 1️⃣ Course আছে কিনা check করা
    const existingCourse = await prisma_1.default.course.findUnique({
        where: { id: courseId },
    });
    if (!existingCourse) {
        throw new ApiError_1.default(404, "Course not found!");
    }
    // 2️⃣ শুধু valid field গুলো পাঠানো (undefined বাদ দিয়ে)
    const updateData = {};
    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) {
            updateData[key] = value;
        }
    });
    // 3️⃣ এখন update করা
    const result = await prisma_1.default.course.update({
        where: { id: courseId },
        data: updateData,
    });
    return result;
};
const deleteCourseFromDB = async (id) => {
    return await prisma_1.default.$transaction(async (tx) => {
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
            throw new ApiError_1.default(404, "Course not found!");
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
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    updatePublishedStatus,
    updateCourseIntoDB,
    getPublishedCoursesFromDB,
    deleteCourseFromDB,
    getRelatedCoursesFromDB,
    getSingleCourseFromDB
};
//# sourceMappingURL=course.service.js.map