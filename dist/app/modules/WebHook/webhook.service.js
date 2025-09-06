"use strict";
// import config from "../../../config";
// import ApiError from "../../../errors/ApiError";
// import stripe from "../../../helpers/stripe";
// import httpStatus from "http-status";
// import prisma from "../../../shared/prisma";
// import { PaymentStatus } from "@prisma/client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookServices = void 0;
// const handleStripeWebHook = async (rawBody: Buffer, signature: string) => {
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       signature,
//       config.stripe.webhook_secret as string
//     );
//   } catch (err: any) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Webhook Error: " + err.message);
//   }
//   console.log("✅ Stripe Event Received:", event.type);
//   if (
//     event.type === "checkout.session.completed" ||
//     event.type === "checkout.session.expired"
//   ) {
//     const session: any = event.data.object;
//     const orderId = session.metadata?.orderId;
//     const orderType = session.metadata?.orderType;
//     console.log("📦 orderId:", orderId, " orderType:", orderType);
//     if (!orderId || !orderType) {
//       console.warn("⚠️ No orderId/orderType found in session.metadata");
//       return { received: true };
//     }
//     switch (orderType) {
//       case "BOOK": {
//         await prisma.orderBook.update({
//           where: { id: orderId },
//           data: {
//             paymentStatus:
//               event.type === "checkout.session.completed"
//                 ? PaymentStatus.PAID
//                 : PaymentStatus.CANCELED,
//             transactionId: session.payment_intent ?? session.id,
//           },
//         });
//         console.log("✅ Book Order Updated");
//         break;
//       }
//       case "COURSE": {
//         const updatedOrder = await prisma.orderCourse.update({
//           where: { id: orderId },
//           data: {
//             paymentStatus:
//               event.type === "checkout.session.completed"
//                 ? PaymentStatus.PAID
//                 : PaymentStatus.CANCELED,
//             transactionId: session.payment_intent ?? session.id,
//           },
//           include: {
//             items: {
//               include: {
//                 course: {
//                   include: {
//                     courseModules: {
//                       include: {
//                         courseModuleVideos: true,
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         });
//         console.log("✅ Course Order Updated");
//         if (event.type === "checkout.session.completed") {
//           const userId = updatedOrder.userId;
//           for (const item of updatedOrder.items) {
//             const course = item.course;
//             if (!course.courseModules.length) {
//               console.warn("⚠️ No modules found for course:", course.id);
//               continue;
//             }
//             // মডিউল এবং ভিডিও sort করে নিলাম
//             const modulesSorted = course.courseModules
//               .map((m) => ({
//                 ...m,
//                 courseModuleVideos: m.courseModuleVideos.sort(
//                   (a, b) => a.order - b.order
//                 ),
//               }))
//               .sort((a, b) => a.order - b.order);
//             const firstModule = modulesSorted[0];
//             const firstVideo = firstModule?.courseModuleVideos[0];
//             if (firstModule && firstVideo) {
//               const existing = await prisma.courseProgress.findUnique({
//                 where: { userId_courseId: { userId, courseId: course.id } },
//               });
//               if (!existing) {
//                 await prisma.courseProgress.create({
//                   data: {
//                     userId,
//                     courseId: course.id,
//                     currentModuleId: firstModule.id,
//                     currentVideoId: firstVideo.id,
//                     completedVideos: [],
//                     completedModules: [],
//                     percentCompleted: 0,
//                     isCompleted: false,
//                     startedAt: new Date(),
//                     lastActivityAt: new Date(),
//                     videoProgress: {
//                       create: {
//                         userId,
//                         courseId: course.id,
//                         videoId: firstVideo.id,
//                         status: "current",
//                       },
//                     },
//                   },
//                 });
//                 console.log("🎯 Progress + VideoProgress Created:", course.id);
//               } else {
//                 if (!existing.currentVideoId) {
//                   await prisma.courseProgress.update({
//                     where: { id: existing.id },
//                     data: {
//                       currentModuleId: firstModule.id,
//                       currentVideoId: firstVideo.id,
//                       lastActivityAt: new Date(),
//                       videoProgress: {
//                         upsert: {
//                           where: {
//                             userId_courseId_videoId: {
//                               userId,
//                               courseId: course.id,
//                               videoId: firstVideo.id,
//                             },
//                           },
//                           create: {
//                             userId,
//                             courseId: course.id,
//                             videoId: firstVideo.id,
//                             status: "current",
//                           },
//                           update: {
//                             status: "current",
//                           },
//                         },
//                       },
//                     },
//                   });
//                   console.log("🔧 Progress + VideoProgress Fixed:", course.id);
//                 } else {
//                   console.log("ℹ️ Progress already exists:", course.id);
//                 }
//               }
//             } else {
//               console.warn(
//                 "⚠️ No videos found in first module of course:",
//                 course.id
//               );
//             }
//           }
//         }
//         break;
//       }
//       default:
//         console.warn(`⚠️ Unknown order type: ${orderType}`);
//     }
//   }
//   return { received: true };
// };
// export const WebhookServices = {
//   handleStripeWebHook,
// };
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const stripe_1 = __importDefault(require("../../../helpers/stripe"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const handleStripeWebHook = async (rawBody, signature) => {
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(rawBody, signature, config_1.default.stripe.webhook_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Webhook Error: " + err.message);
    }
    console.log("✅ Stripe Event Received:", event.type);
    if (event.type === "checkout.session.completed" ||
        event.type === "checkout.session.expired") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const orderType = session.metadata?.orderType;
        console.log("📦 orderId:", orderId, " orderType:", orderType);
        if (!orderId || !orderType) {
            console.warn("⚠️ No orderId/orderType found in session.metadata");
            return { received: true };
        }
        switch (orderType) {
            case "BOOK": {
                await prisma_1.default.orderBook.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: event.type === "checkout.session.completed"
                            ? client_1.PaymentStatus.PAID
                            : client_1.PaymentStatus.CANCELED,
                        transactionId: session.payment_intent ?? session.id,
                    },
                });
                console.log("✅ Book Order Updated");
                break;
            }
            case "COURSE": {
                const updatedOrder = await prisma_1.default.orderCourse.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: event.type === "checkout.session.completed"
                            ? client_1.PaymentStatus.PAID
                            : client_1.PaymentStatus.CANCELED,
                        transactionId: session.payment_intent ?? session.id,
                    },
                    include: {
                        items: {
                            include: {
                                course: {
                                    include: {
                                        courseModules: {
                                            include: {
                                                courseModuleVideos: true,
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
                        if (!course.courseModules.length)
                            continue;
                        const modulesSorted = course.courseModules
                            .map((m) => ({
                            ...m,
                            courseModuleVideos: m.courseModuleVideos.sort((a, b) => a.order - b.order),
                        }))
                            .sort((a, b) => a.order - b.order);
                        const firstModule = modulesSorted[0];
                        const firstVideo = firstModule?.courseModuleVideos[0];
                        if (!firstModule || !firstVideo)
                            continue;
                        const existing = await prisma_1.default.courseProgress.findUnique({
                            where: { userId_courseId: { userId, courseId: course.id } },
                        });
                        if (!existing) {
                            await prisma_1.default.courseProgress.create({
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
                            console.log("🎯 CourseProgress Created for course:", course.id);
                        }
                        else if (!existing.currentVideoId) {
                            await prisma_1.default.courseProgress.update({
                                where: { id: existing.id },
                                data: {
                                    currentModuleId: firstModule.id,
                                    currentVideoId: firstVideo.id,
                                    lastActivityAt: new Date(),
                                },
                            });
                            console.log("🔧 CourseProgress Fixed for course:", course.id);
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
exports.WebhookServices = { handleStripeWebHook };
//# sourceMappingURL=webhook.service.js.map