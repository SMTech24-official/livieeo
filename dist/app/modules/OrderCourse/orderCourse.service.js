"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCourseServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("../../../helpers/stripe"));
const config_1 = __importDefault(require("../../../config"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const createCourseOrderIntoDB = async (payload, user) => {
    const userId = user.id;
    const { courseIds } = payload;
    if (!courseIds?.length)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No course ids provided");
    const courses = await prisma_1.default.course.findMany({ where: { id: { in: courseIds } } });
    if (!courses.length)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No courses found");
    // Check already purchased
    const alreadyBought = await prisma_1.default.orderCourseItem.findMany({
        where: {
            courseId: { in: courseIds },
            order: { userId, paymentStatus: "PAID" },
        },
        select: { courseId: true },
    });
    if (alreadyBought.length) {
        const boughtNames = courses.filter(c => alreadyBought.map(a => a.courseId).includes(c.id))
            .map(c => c.courseTitle).join(", ");
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Already purchased: ${boughtNames}`);
    }
    const totalAmount = courses.reduce((sum, c) => sum + c.discountPrice, 0);
    const order = await prisma_1.default.orderCourse.create({
        data: { userId, amount: totalAmount, paymentStatus: "PENDING", paymentMethod: "STRIPE" },
    });
    await prisma_1.default.orderCourseItem.createMany({
        data: courses.map(c => ({ orderId: order.id, courseId: c.id, price: c.discountPrice, quantity: 1 })),
    });
    const session = await stripe_1.default.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: courses.map(c => ({
            price_data: {
                currency: "usd",
                product_data: { name: c.courseTitle, description: c.description ?? "" },
                unit_amount: Math.round(c.discountPrice * 100),
            },
            quantity: 1,
        })),
        mode: "payment",
        success_url: config_1.default.stripe.success_url ?? "",
        cancel_url: config_1.default.stripe.fail_url ?? "",
        metadata: { orderId: order.id, orderType: "COURSE", userId },
    });
    return { orderId: order.id, paymentUrl: session.url };
};
const getAllOrderedCoursesFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.orderCourse, query);
    const orders = await queryBuilder
        .range()
        .search([""]) // search এর জন্য কোন field ব্যবহার করবেন সেটা দিন (যেমন courseTitle, user.email etc.)
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
        include: {
            user: true, // user info আসবে
            items: {
                include: {
                    course: true, // প্রতিটি order item এর ভিতরে course details আসবে
                },
            },
        },
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: orders };
};
// const getMyOrderedCoursesFromDB = async (query: Record<string, any>, userId: string): Promise<IGenericResponse<OrderCourse[]>> => {
//   console.log("USERiD", userId)
//   const queryBuilder = new QueryBuilder(prisma.orderCourse, query);
//   const myCourses = await queryBuilder
//     .range()
//     .search(["courseTitle"])
//     .filter()
//     .sort()
//     .paginate()
//     .fields()
//     .execute(
//       {
//         where: {
//           userId,
//           paymentStatus: "PAID"
//         },
//         include: {
//           user: true,
//           items: {
//             include: {
//               course: true,
//             },
//           },
//         },
//       }
//     );
//   const meta = await queryBuilder.countTotal();
//   return { meta, data: myCourses }
// }
const getMyOrderedCoursesFromDB = async (query, userId) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.orderCourse, query);
    const myCourses = await queryBuilder
        .range()
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            userId,
            paymentStatus: "PAID",
            items: {
                some: {
                    course: {
                        courseTitle: {
                            contains: query.searchTerm || "", // 🔍 এখানে search হবে
                            mode: "insensitive",
                        },
                    },
                },
            },
        },
        include: {
            user: true,
            items: {
                include: {
                    course: true,
                },
            },
        },
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: myCourses };
};
exports.OrderCourseServices = {
    createCourseOrderIntoDB,
    getAllOrderedCoursesFromDB,
    getMyOrderedCoursesFromDB
};
//# sourceMappingURL=orderCourse.service.js.map