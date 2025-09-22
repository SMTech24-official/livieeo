import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import stripe from "../../../helpers/stripe";
import config from "../../../config";
import { IGenericResponse } from "../../../interfaces/common";
import { OrderCourse } from "@prisma/client";
import QueryBuilder from "../../../helpers/queryBuilder";

const createCourseOrderIntoDB = async (
  payload: { courseIds: string[] },
  user: JwtPayload
) => {
  const userId = user.id;
  const { courseIds } = payload;

  if (!courseIds?.length)
    throw new ApiError(httpStatus.BAD_REQUEST, "No course ids provided");

  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
  });
  if (!courses.length)
    throw new ApiError(httpStatus.NOT_FOUND, "No courses found");

  // Check already purchased
  const alreadyBought = await prisma.orderCourseItem.findMany({
    where: {
      courseId: { in: courseIds },
      order: { userId, paymentStatus: "PAID" },
    },
    select: { courseId: true },
  });
  if (alreadyBought.length) {
    const boughtNames = courses
      .filter((c) => alreadyBought.map((a) => a.courseId).includes(c.id))
      .map((c) => c.courseTitle)
      .join(", ");
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already purchased: ${boughtNames}`
    );
  }

  const totalAmount = courses.reduce((sum, c) => sum + c.discountPrice, 0);

  const order = await prisma.orderCourse.create({
    data: {
      userId,
      amount: totalAmount,
      paymentStatus: "PENDING",
      paymentMethod: "STRIPE",
    },
  });

  await prisma.orderCourseItem.createMany({
    data: courses.map((c) => ({
      orderId: order.id,
      courseId: c.id,
      price: c.discountPrice,
      quantity: 1,
    })),
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: courses.map((c) => ({
      price_data: {
        currency: "usd",
        product_data: { name: c.courseTitle, description: c.description ?? "" },
        unit_amount: Math.round(c.discountPrice * 100),
      },
      quantity: 1,
    })),
    mode: "payment",
    success_url: config.stripe.success_url ?? "",
    cancel_url: config.stripe.fail_url ?? "",
    metadata: { orderId: order.id, orderType: "COURSE", userId },
  });

  return { orderId: order.id, paymentUrl: session.url };
};

const getAllOrderedCoursesFromDB = async (
  query: Record<string, any>
): Promise<IGenericResponse<OrderCourse[]>> => {
  const queryBuilder = new QueryBuilder(prisma.orderCourse,  query);

  const orders = await queryBuilder
    .range()
    .search([""]) // search এর জন্য কোন field ব্যবহার করবেন সেটা দিন (যেমন courseTitle, user.email etc.)
    .filter(["paymentStatus"])
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

const getMyOrderedCoursesFromDB = async (
  query: Record<string, any>,
  userId: string
): Promise<IGenericResponse<OrderCourse[]>> => {
  const queryBuilder = new QueryBuilder(prisma.orderCourse, query);

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
export const OrderCourseServices = {
  createCourseOrderIntoDB,
  getAllOrderedCoursesFromDB,
  getMyOrderedCoursesFromDB,
};
