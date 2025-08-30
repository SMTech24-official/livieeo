// import config from "../../../config";
// import ApiError from "../../../errors/ApiError";
// import stripe from "../../../helpers/stripe";
// import httpStatus from "http-status";
// import prisma from "../../../shared/prisma";
// import { PaymentStatus } from "@prisma/client";

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

//   if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
//     const session: any = event.data.object;
//     const orderId = session.metadata?.orderId;
//     const orderType = session.metadata?.orderType;

//     if (orderId && orderType) {
//       try {
//         switch (orderType) {
//           case "BOOK":
//             await prisma.orderBook.update({
//               where: { id: orderId },
//               data: {
//                 paymentStatus:
//                   event.type === "checkout.session.completed"
//                     ? PaymentStatus.PAID
//                     : PaymentStatus.CANCELED,
//                 transactionId: session.payment_intent ?? session.id,
//               },
//               include: { items: true },
//             });
//             break;

//           case "COURSE":
//             // Update payment status
//             const updatedOrder = await prisma.orderCourse.update({
//               where: { id: orderId },
//               data: {
//                 paymentStatus:
//                   event.type === "checkout.session.completed"
//                     ? PaymentStatus.PAID
//                     : PaymentStatus.CANCELED,
//                 transactionId: session.payment_intent ?? session.id,
//               },
//               include: {
//                 items: {
//                   include: {
//                     course: {
//                       include: {
//                         courseModules: { include: { courseModuleVideos: true }, orderBy: { id: "asc" } },
//                       },
//                     },
//                   },
//                 },
//               },
//             });

//             // ✅ Payment successful → initialize progress
//             if (event.type === "checkout.session.completed") {
//               const userId = updatedOrder.userId;

//               for (const item of updatedOrder.items) {
//                 const course = item.course;

//                 const firstModule = course.courseModules[0];
//                 const firstVideo = firstModule?.courseModuleVideos[0];

//                 if (firstModule && firstVideo) {
//                   const existingProgress = await prisma.courseProgress.findFirst({
//                     where: { userId, courseId: course.id },
//                   });

//                   if (!existingProgress) {
//                     await prisma.courseProgress.create({
//                       data: {
//                         userId,
//                         courseId: course.id,
//                         currentModuleId: firstModule.id,
//                         currentVideoId: firstVideo.id,
//                         completedVideos: [],
//                         completedModules: [],
//                         isCompleted: false,
//                       },
//                     });
//                   }
//                 }
//               }
//             }
//             break;

//           default:
//             console.warn(`Unknown order type: ${orderType}`);
//         }
//       } catch (error: any) {
//         throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update order status: " + error.message);
//       }
//     }
//   }

//   return { received: true };
// };

// export const WebhookServices = {
//   handleStripeWebHook,
// };


import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import stripe from "../../../helpers/stripe";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

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

//   if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
//     const session: any = event.data.object;
//     const orderId = session.metadata?.orderId;
//     const orderType = session.metadata?.orderType;

//     console.log("📦 orderId:", orderId, " orderType:", orderType);

//     if (orderId && orderType) {
//       switch (orderType) {
//         case "BOOK": {
//           await prisma.orderBook.update({
//             where: { id: orderId },
//             data: {
//               paymentStatus:
//                 event.type === "checkout.session.completed"
//                   ? PaymentStatus.PAID
//                   : PaymentStatus.CANCELED,
//               transactionId: session.payment_intent ?? session.id,
//             },
//           });
//           console.log("✅ Book Order Updated");
//           break;
//         }

//         case "COURSE": {
//           const updatedOrder = await prisma.orderCourse.update({
//             where: { id: orderId },
//             data: {
//               paymentStatus:
//                 event.type === "checkout.session.completed"
//                   ? PaymentStatus.PAID
//                   : PaymentStatus.CANCELED,
//               transactionId: session.payment_intent ?? session.id,
//             },
//             include: {
//               items: {
//                 include: {
//                   course: {
//                     include: {
//                       courseModules: {
//                         include: { courseModuleVideos: true },
//                         orderBy: { order: "asc" },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           });

//           console.log("✅ Course Order Updated");

//           if (event.type === "checkout.session.completed") {
//             const userId = updatedOrder.userId;

//             for (const item of updatedOrder.items) {
//               const course = item.course;

//               const firstModule = course.courseModules.sort((a, b) => a.order - b.order)[0];
//               const firstVideo = firstModule?.courseModuleVideos.sort((a, b) => a.order - b.order)[0];

//               if (firstModule && firstVideo) {
//                 const existing = await prisma.courseProgress.findUnique({
//                   where: { userId_courseId: { userId, courseId: course.id } },
//                 });

//                 if (!existing) {
//                   await prisma.courseProgress.create({
//                     data: {
//                       userId,
//                       courseId: course.id,
//                       currentModuleId: firstModule.id,
//                       currentVideoId: firstVideo.id,
//                       completedVideos: [],
//                       completedModules: [],
//                       percentCompleted: 0,
//                       isCompleted: false,
//                       startedAt: new Date(),
//                       lastActivityAt: new Date(),
//                     },
//                   });
//                   console.log("🎯 Progress Created for course:", course.id);
//                 }
//               }
//             }
//           }
//           break;
//         }

//         default:
//           console.warn(`⚠️ Unknown order type: ${orderType}`);
//       }
//     } else {
//       console.warn("⚠️ No orderId/orderType found in session.metadata");
//     }
//   }

//   return { received: true };
// };



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

//   if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
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
//                         courseModuleVideos: { orderBy: { order: "asc" } }, // ✅ ভিডিওগুলিও order হয়ে আসবে
//                       },
//                       orderBy: { order: "asc" }, // ✅ মডিউলগুলিও order হয়ে আসবে
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

//             const firstModule = course.courseModules[0];
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
//                   },
//                 });
//                 console.log("🎯 Progress Created for course:", course.id);
//               } else {
//                 console.log("ℹ️ Progress already exists for course:", course.id);
//               }
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






const handleStripeWebHook = async (rawBody: Buffer, signature: string) => {
  let event;
  try { event = stripe.webhooks.constructEvent(rawBody, signature, config.stripe.webhook_secret as string); }
  catch (err: any) { throw new ApiError(httpStatus.BAD_REQUEST, "Webhook Error: " + err.message); }

  if (event.type !== "checkout.session.completed") return { received: true };

  const session: any = event.data.object;
  const orderId = session.metadata?.orderId;
  if (!orderId) return { received: true };

  const updatedOrder = await prisma.orderCourse.update({
    where: { id: orderId },
    data: { paymentStatus: PaymentStatus.PAID, transactionId: session.payment_intent ?? session.id },
    include: { items: { include: { course: { include: { courseModules: { include: { courseModuleVideos: true }, orderBy: { order: "asc" } } } } } } },
  });

  const userId = updatedOrder.userId;

  for (const item of updatedOrder.items) {
    const course = item.course;
    const firstModule = course.courseModules.sort((a,b)=>a.order-b.order)[0];
    const firstVideo = firstModule?.courseModuleVideos.sort((a,b)=>a.order-b.order)[0];

    if (!firstModule || !firstVideo) continue;

    const existingProgress = await prisma.courseProgress.findUnique({ where: { userId_courseId: { userId, courseId: course.id } } });
    if (!existingProgress) {
      await prisma.courseProgress.create({
        data: { userId, courseId: course.id, currentModuleId: firstModule.id, currentVideoId: firstVideo.id, completedVideos: [], completedModules: [], percentCompleted: 0, isCompleted: false, startedAt: new Date(), lastActivityAt: new Date() }
      });
    }
  }

  return { received: true };
};
export const WebhookServices = {
  handleStripeWebHook,
};