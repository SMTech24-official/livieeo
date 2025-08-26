// import { OrderBook, PaymentStatus } from "@prisma/client";
// import { JwtPayload } from "jsonwebtoken";
// import prisma from "../../../shared/prisma";
// import ApiError from "../../../errors/ApiError";
// import httpStatus from "http-status";
// import stripe from "../../../helpers/stripe";
// import config from "../../../config";


// const createCourseOrderIntoDB = async (
//   payload: { courseIds: string[] },
//   user: JwtPayload
// ) => {
//   const userId = user.id;
//   const { courseIds } = payload;

//   // find all courses
//   const courses = await prisma.course.findMany({
//     where: { id: { in: courseIds } },
//   });

//   if (courses.length === 0) {
//     throw new ApiError(httpStatus.NOT_FOUND, "No course found !");
//   }

//   // total amount sum
//   const totalAmount = courses.reduce((sum, book) => sum + book.price, 0);

//   // create order in DB
//   const order = await prisma.orderCourse.create({
//     data: {
//       userId,
//       courseIds, // save all bookIds
//       amount: totalAmount
//     },
//   });

//   // stripe checkout session (hosted payment page)
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: courses.map((course) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: course.courseTitle,
//           description: course.description ?? "Course purchase",
//         },
//         unit_amount: Math.round(course.price * 100), // in cents
//       },
//       quantity: 1,
//     })),
//     mode: "payment",
//     success_url: `${config.stripe.success_url}`,
//     cancel_url: `${config.stripe.fail_url}`,
//     metadata: {
//       orderId: order.id,
//       orderType: "COURSE", // 📌 important to identify
//       userId,
//     },
//   });

//   return {
//     orderId: order.id,
//     paymentUrl: session.url, // direct payment URL
//   };
// };

// export const OrderCourseServices = {
//   createCourseOrderIntoDB
// }

import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import stripe from "../../../helpers/stripe";
import config from "../../../config";
import { IGenericResponse } from "../../../interfaces/common";
import { OrderCourse, UserRole } from "@prisma/client";
import QueryBuilder from "../../../helpers/queryBuilder";

const createCourseOrderIntoDB = async (
  payload: { courseIds: string[] },
  user: JwtPayload
) => {
  const userId = user.id;
  const { courseIds } = payload;

  // find all courses
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
  });

  if (courses.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No courses found!");
  }

  // total amount sum
  const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);

  // 1️⃣ create order
  const order = await prisma.orderCourse.create({
    data: {
      userId,
      amount: totalAmount,
      paymentStatus: "PENDING",
      paymentMethod: "STRIPE",
    },
  });

  // 2️⃣ create order items
  await prisma.orderCourseItem.createMany({
    data: courses.map((course) => ({
      orderId: order.id,
      courseId: course.id,
      price: course.price,
      quantity: 1,
    })),
  });

  // 3️⃣ stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: courses.map((course) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: course.courseTitle,
          description: course.description ?? "Course purchase",
        },
        unit_amount: Math.round(course.price * 100), // in cents
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: `${config.stripe.success_url}`,
    cancel_url: `${config.stripe.fail_url}`,
    metadata: {
      orderId: order.id,
      orderType: "COURSE",
      userId,
    },
  });

  return {
    orderId: order.id,
    paymentUrl: session.url,
  };
};
const getAllOrderedCoursesFromDB = async (
  query: Record<string, any>
): Promise<IGenericResponse<OrderCourse[]>> => {
  const queryBuilder = new QueryBuilder(prisma.orderCourse, query);

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

const getMyOrderedCoursesFromDB = async (query: Record<string, any>, userEmail: string): Promise<IGenericResponse<OrderCourse[]>> => {
  const queryBuilder = new QueryBuilder(prisma.orderCourse, query);
  const myCourses = await queryBuilder
    .range()
    .search([""])
    .filter()
    .sort()
    .paginate()
    .fields()
    .execute(
      {
        where: {
          user: {
            email: userEmail
          },
          paymentStatus: "PAID"
        },
        include: {
          user: true,
          items: {
            include: {
              course: true,
            },
          },
        },
      }
    );
  const meta = await queryBuilder.countTotal();
  return { meta, data: myCourses }
}
export const OrderCourseServices = {
  createCourseOrderIntoDB,
  getAllOrderedCoursesFromDB,
  getMyOrderedCoursesFromDB
};