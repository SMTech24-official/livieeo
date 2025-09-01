import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import stripe from "../../../helpers/stripe";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleStripeWebHook = async (rawBody: Buffer, signature: string) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhook_secret as string
    );
  } catch (err: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Webhook Error: " + err.message);
  }

  console.log("✅ Stripe Event Received:", event.type);

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
    const session: any = event.data.object;
    const orderId = session.metadata?.orderId;
    const orderType = session.metadata?.orderType;

    console.log("📦 orderId:", orderId, " orderType:", orderType);

    if (!orderId || !orderType) {
      console.warn("⚠️ No orderId/orderType found in session.metadata");
      return { received: true };
    }

    switch (orderType) {
      case "BOOK": {
        await prisma.orderBook.update({
          where: { id: orderId },
          data: {
            paymentStatus:
              event.type === "checkout.session.completed"
                ? PaymentStatus.PAID
                : PaymentStatus.CANCELED,
            transactionId: session.payment_intent ?? session.id,
          },
        });
        console.log("✅ Book Order Updated");
        break;
      }

      case "COURSE": {
        const updatedOrder = await prisma.orderCourse.update({
          where: { id: orderId },
          data: {
            paymentStatus:
              event.type === "checkout.session.completed"
                ? PaymentStatus.PAID
                : PaymentStatus.CANCELED,
            transactionId: session.payment_intent ?? session.id,
          },
          include: {
            items: {
              include: {
                course: {
                  include: {
                    courseModules: {
                      include: {
                        courseModuleVideos: true, // ভিডিও গুলো প্রথমে নিয়ে আসবো
                      },
                    },
                  },
                },
              },
            },
          },
        });

        console.log("✅ Course Order Updated");

        if (event.type === "checkout.session.completed") {
          const userId = updatedOrder.userId;

          for (const item of updatedOrder.items) {
            const course = item.course;

            if (!course.courseModules.length) {
              console.warn("⚠️ No modules found for course:", course.id);
              continue;
            }

            // ✅ সবসময় proper sorted list বানাচ্ছি
            const modulesSorted = course.courseModules
              .map((m) => ({
                ...m,
                courseModuleVideos: m.courseModuleVideos.sort(
                  (a, b) => a.order - b.order
                ),
              }))
              .sort((a, b) => a.order - b.order);

            const firstModule = modulesSorted[0];
            const firstVideo = firstModule?.courseModuleVideos[0];

            if (firstModule && firstVideo) {
              const existing = await prisma.courseProgress.findUnique({
                where: { userId_courseId: { userId, courseId: course.id } },
              });

              if (!existing) {
                await prisma.courseProgress.create({
                  data: {
                    userId,
                    courseId: course.id,
                    currentModuleId: firstModule.id,
                    currentVideoId: firstVideo.id,
                    completedVideos: [],
                    completedModules: [],
                    percentCompleted: 0,
                    isCompleted: false,
                    startedAt: new Date(),
                    lastActivityAt: new Date(),
                  },
                });
                console.log("🎯 Progress Created for course:", course.id);
              } else {
                // ✅ যদি আগে থাকে কিন্তু currentVideoId null থাকে → fix করে দিচ্ছি
                if (!existing.currentVideoId) {
                  await prisma.courseProgress.update({
                    where: { id: existing.id },
                    data: {
                      currentModuleId: firstModule.id,
                      currentVideoId: firstVideo.id,
                      lastActivityAt: new Date(),
                    },
                  });
                  console.log("🔧 Progress Fixed for course:", course.id);
                } else {
                  console.log("ℹ️ Progress already exists for course:", course.id);
                }
              }
            } else {
              console.warn("⚠️ No videos found in first module of course:", course.id);
            }
          }
        }
        break;
      }

      default:
        console.warn(`⚠️ Unknown order type: ${orderType}`);
    }
  }

  return { received: true };
};

export const WebhookServices = {
  handleStripeWebHook,
};