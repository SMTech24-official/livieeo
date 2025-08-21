import { OrderCourse, PaymentStatus } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status"
import stripe from "../../../helpers/stripe";
import config from "../../../config";

const createCourseOrderIntoDB = async (payload: OrderCourse, user: JwtPayload) => {
  const userId = user.id;
  const { courseId, paymentMethod } = payload;

  // find course
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course not found !");
  }

  // create order in DB
  const order = await prisma.orderCourse.create({
    data: {
      userId,
      courseId,
      amount: course.price,
      paymentMethod,
      paymentStatus: "PENDING",
    },
  });

  // stripe checkout session (hosted payment page)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.courseTitle,
            description: course.description ?? "Course purchase",
          },
          unit_amount: Math.round(course.price * 100), // amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // success_url: `http://localhost:5000/payment/success?orderId=${order.id}`,
    // cancel_url: `http://localhost:5000/payment/cancel?orderId=${order.id}`,
    success_url: `${config.stripe.success_url}`,
    cancel_url: `${config.stripe.fail_url}`,
    metadata: {
      orderId: order.id,
      orderType: "COURSE", // 📌 important
      userId,
    },
  });

  return {
    orderId: order.id,
    paymentUrl: session.url, // direct payment URL
  };
};

const getMyCourseFromDB = async (userId: string): Promise<OrderCourse[]> => {
    const result = await prisma.orderCourse.findMany({
        where: {
            userId,
            paymentStatus: PaymentStatus.PAID
        }
    });
    if (!result || result.length === 0) {
        throw new ApiError(404, "No course found for this user");
    }
    return result;
}

export const OrderCourseServices = {
    createCourseOrderIntoDB,
    getMyCourseFromDB
}