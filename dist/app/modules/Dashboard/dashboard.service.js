"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServices = exports.getRecentActivities = exports.saveActivity = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// const totalRevenue = async()=> {
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
//     const bookRevenue = await prisma.orderBook.aggregate({
//         _sum: {
//             amount: true
//         },
//         where: {
//             createdAt: {
//                 gte: startOfMonth,
//                 lte: endOfMonth
//             },
//             paymentStatus: PaymentStatus.PAID
//         }
//     })
//     const courseRevenue = await prisma.orderCourse.aggregate({
//         _sum: {
//             amount: true
//         },
//         where: {
//             createdAt: {
//                 gte: startOfMonth,
//                 lte: endOfMonth
//             },
//             paymentStatus: PaymentStatus.PAID
//         }
//     })
//     return (bookRevenue._sum.amount || 0) + (courseRevenue._sum.amount || 0);
// }
// const bookSalesCount = async () => {
//   const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//   const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
//   // এখানে aggregate ব্যবহার করা হলো
//   const result = await prisma.orderBook.aggregate({
//     _sum: {
//       amount: true, // ⭐ total dollar sum বের করবে
//     },
//     where: {
//       createdAt: {
//         gte: startOfMonth,
//         lte: endOfMonth,
//       },
//       paymentStatus: PaymentStatus.PAID, // শুধু paid order গুনবে
//     },
//   });
//   return result._sum.amount || 0; // যদি null হয় তাহলে 0 return করব
// };
// const courseEnrollments = async()=> {
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
//     const courseEnrollments = await prisma.orderCourse.count({
//         where: {
//             createdAt: {
//                 gte: startOfMonth,
//                 lte: endOfMonth
//             },
//             paymentStatus: PaymentStatus.PAID
//         }
//     })
//     return courseEnrollments;
// }
// const speakingInquires = async()=> {
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
//     const inquiries = await prisma.bookingBookSpeaker.count({
//         where: {
//             createdAt: {
//                 gte: startOfMonth,
//                 lte: endOfMonth
//             }
//         }
//     })
//     return inquiries;
// }
// const newMemberOfThisMonth = async()=> {
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
//     const newMembers = await prisma.user.count({
//         where: {
//             createdAt: {
//                 gte: startOfMonth,
//                 lte: endOfMonth
//             }
//         }
//     })
//     return newMembers;
// }
// const webVisitorOfThisMonth = async()=> {
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
//     const visitors = await prisma.webVisitor.count({
//         where: {
//             createdAt: {
//                 gte: startOfMonth,
//                 lte: endOfMonth
//             }
//         }
//     })
//     return visitors;
// }
const dashboardStats = async () => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    // সবগুলো প্রমিস একসাথে রান করার জন্য Promise.all ব্যবহার করব
    const [bookRevenue, courseRevenue, bookSales, courseEnrollments, speakingInquiries, newMembers, webVisitors] = await Promise.all([
        prisma_1.default.orderBook.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: startOfMonth, lte: endOfMonth },
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        }),
        prisma_1.default.orderCourse.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: startOfMonth, lte: endOfMonth },
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        }),
        prisma_1.default.orderBook.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: { gte: startOfMonth, lte: endOfMonth },
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        }),
        prisma_1.default.orderCourse.count({
            where: {
                createdAt: { gte: startOfMonth, lte: endOfMonth },
                paymentStatus: client_1.PaymentStatus.PAID,
            },
        }),
        prisma_1.default.bookingBookSpeaker.count({
            where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        }),
        prisma_1.default.user.count({
            where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        }),
        prisma_1.default.webVisitor.count({
            where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        }),
    ]);
    return {
        totalRevenue: (bookRevenue._sum.amount || 0) + (courseRevenue._sum.amount || 0),
        bookSalesCount: bookSales._sum.amount || 0,
        courseEnrollments,
        speakingInquiries,
        newMembers,
        webVisitors,
    };
};
const saveActivity = async (userId, product, type) => {
    const activity = await prisma_1.default.activity.create({
        data: {
            userId,
            product,
            type, // এখন ঠিক আছে
        },
    });
    return activity;
};
exports.saveActivity = saveActivity;
const getRecentActivities = async () => {
    const activities = await prisma_1.default.activity.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 5, // শুধু সর্বশেষ ৫টা দেখাবো
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    photoUrl: true
                },
            },
        },
    });
    return activities.map(act => ({
        name: `${act.user.firstName} ${act.user.lastName}`,
        product: act.product,
        type: act.type,
        timeAgo: act.createdAt, // UI তে আপনি "1 min ago" এ কনভার্ট করবেন
        profileImage: act.user.photoUrl
    }));
};
exports.getRecentActivities = getRecentActivities;
// Top Selling Books
// const getTopSellingBooks = async () => {
//   const result = await prisma.orderBookItem.groupBy({
//     by: ["bookId"],
//     _sum: {
//       quantity: true,
//     },
//     orderBy: {
//       _sum: {
//         quantity: "desc",
//       },
//     },
//     take: 5,
//   });
//   // book details join করতে হবে
//   const books = await Promise.all(
//     result.map(async (item) => {
//       const book = await prisma.book.findUnique({
//         where: { id: item.bookId },
//       });
//       return {
//         bookId: item.bookId,
//         bookName: book?.bookName,
//         authorName: book?.authorName,
//         totalSold: item._sum.quantity || 0,
//         price: book?.price,
//         cover: book?.bookCover,
//       };
//     })
//   );
//   return books;
// };
// Top Selling Books
const getTopSellingBooks = async () => {
    const result = await prisma_1.default.orderBookItem.groupBy({
        by: ["bookId"],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: 5,
    });
    // book details join করতে হবে
    const books = await Promise.all(result.map(async (item) => {
        const book = await prisma_1.default.book.findUnique({
            where: { id: item.bookId },
        });
        return {
            bookId: item.bookId,
            bookName: book?.bookName,
            authorName: book?.authorName,
            totalSold: item._sum.quantity || 0,
            price: book?.price,
            cover: book?.bookCover,
        };
    }));
    // 📌 সর্বোচ্চ sold বের করা
    const maxSold = Math.max(...books.map((b) => b.totalSold));
    // 📌 percentage field যোগ করা
    const booksWithProgress = books.map((b) => ({
        ...b,
        progress: maxSold > 0 ? Math.round((b.totalSold / maxSold) * 100) : 0,
    }));
    return booksWithProgress;
};
// Top Selling Courses
// const getTopSellingCourses = async () => {
//   const result = await prisma.orderCourseItem.groupBy({
//     by: ["courseId"],
//     _sum: {
//       quantity: true,
//     },
//     orderBy: {
//       _sum: {
//         quantity: "desc",
//       },
//     },
//     take: 5,
//   });
//   const courses = await Promise.all(
//     result.map(async (item) => {
//       const course = await prisma.course.findUnique({
//         where: { id: item.courseId },
//       });
//       return {
//         courseId: item.courseId,
//         courseTitle: course?.courseTitle,
//         mentorName: course?.mentorName,
//         totalSold: item._sum.quantity || 0,
//         price: course?.price,
//       };
//     })
//   );
//   return courses;
// };
// Top Selling Courses
const getTopSellingCourses = async () => {
    const result = await prisma_1.default.orderCourseItem.groupBy({
        by: ["courseId"],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: 5,
    });
    const courses = await Promise.all(result.map(async (item) => {
        const course = await prisma_1.default.course.findUnique({
            where: { id: item.courseId },
        });
        return {
            courseId: item.courseId,
            courseTitle: course?.courseTitle,
            mentorName: course?.mentorName,
            totalSold: item._sum.quantity || 0,
            price: course?.price,
        };
    }));
    // 📌 সর্বোচ্চ sold বের করা
    const maxSold = Math.max(...courses.map((c) => c.totalSold));
    // 📌 percentage field যোগ করা
    const coursesWithProgress = courses.map((c) => ({
        ...c,
        progress: maxSold > 0 ? Math.round((c.totalSold / maxSold) * 100) : 0,
    }));
    return coursesWithProgress;
};
exports.DashboardServices = {
    // totalRevenue,
    // bookSalesCount,
    // courseEnrollments,
    // speakingInquires,
    // newMemberOfThisMonth,
    // webVisitorOfThisMonth,
    dashboardStats,
    getRecentActivities: exports.getRecentActivities,
    getTopSellingBooks,
    getTopSellingCourses
};
//# sourceMappingURL=dashboard.service.js.map