// import config from "../../../config";
// import ApiError from "../../../errors/ApiError";
// import stripe from "../../../helpers/stripe";
// import httpStatus from "http-status";
// import prisma from "../../../shared/prisma";
// import { PaymentStatus } from "@prisma/client";

// const handleStripeWebHook = async (rawBody: Buffer, signature: string) => {
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(
//             rawBody,
//             signature,
//             config.stripe.webhook_secret as string
//         );
//     } catch (err: any) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Webhook Error: " + err.message);
//     }

//     if (
//         event.type === "checkout.session.completed" ||
//         event.type === "checkout.session.expired"
//     ) {
//         const session: any = event.data.object;
//         const orderId = session.metadata?.orderId;
//         const orderType = session.metadata?.orderType;

//         if (orderId && orderType) {
//             try {
//                 switch (orderType) {
//                     case "BOOK":
//                         await prisma.orderBook.update({
//                             where: { id: orderId },
//                             data: {
//                                 paymentStatus:
//                                     event.type === "checkout.session.completed"
//                                         ? PaymentStatus.PAID
//                                         : PaymentStatus.CANCELED,
//                                 transactionId: session.payment_intent ?? session.id,
                                
//                             },
//                             include: {items: true}
//                         });
                        
//                         break;

//                     // case "COURSE":
//                     //     await prisma.orderCourse.update({
//                     //         where: { id: orderId },
//                     //         data: {
//                     //             paymentStatus:
//                     //                 event.type === "checkout.session.completed"
//                     //                     ? PaymentStatus.PAID
//                     //                     : PaymentStatus.CANCELED,
//                     //             transactionId: session.payment_intent ?? session.id,
//                     //         },
//                     //         include: {items: true}
//                     //     });
//                     //     break;






// case "COURSE":
//   const updatedOrder = await prisma.orderCourse.update({
//     where: { id: orderId },
//     data: {
//       paymentStatus:
//         event.type === "checkout.session.completed"
//           ? PaymentStatus.PAID
//           : PaymentStatus.CANCELED,
//       transactionId: session.payment_intent ?? session.id,
//     },
//     include: { items: { include: { course: { include: { courseModules: { include: { courseModuleVideos: true } } } } } } },
//   });

//   // ✅ যদি payment সফল হয় তাহলে progress create হবে
//   if (event.type === "checkout.session.completed") {
//     const userId = updatedOrder.userId;

//     for (const item of updatedOrder.items) {
//       const course = item.course;

//       // course এর প্রথম module + প্রথম video বের করা
//       const firstModule = course.courseModules[0];
//       const firstVideo = firstModule?.courseModuleVideos[0];

//       if (firstModule && firstVideo) {
//         // check user already progress তৈরি করেছে কিনা
//         const existing = await prisma.courseProgress.findFirst({
//           where: { userId, courseId: course.id }
//         });

//         if (!existing) {
//           await prisma.courseProgress.create({
//             data: {
//               userId,
//               courseId: course.id,
//               currentModuleId: firstModule.id,
//               currentVideoId: firstVideo.id,
//               completedVideos: [],
//               completedModules: [],
//             },
//           });
//         }
//       }
//     }
//   }
//   break;







//                     default:
//                         console.warn(`Unknown order type: ${orderType}`);
//                 }
//             } catch (error) {
//                 throw new ApiError(
//                     httpStatus.INTERNAL_SERVER_ERROR,
//                     "Failed to update order status"
//                 );
//             }
//         }
//     }

//     return { received: true };
// };


// export const WebhookServices = {
//     handleStripeWebHook
// }



import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import stripe from "../../../helpers/stripe";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
import { CourseCertificateServices } from "../CourseCertificate/courseCertificate.service";

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

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
    const session: any = event.data.object;
    const orderId = session.metadata?.orderId;
    const orderType = session.metadata?.orderType;

    if (orderId && orderType) {
      try {
        switch (orderType) {
          case "BOOK":
            await prisma.orderBook.update({
              where: { id: orderId },
              data: {
                paymentStatus:
                  event.type === "checkout.session.completed"
                    ? PaymentStatus.PAID
                    : PaymentStatus.CANCELED,
                transactionId: session.payment_intent ?? session.id,
              },
              include: { items: true },
            });
            break;

          case "COURSE":
            // Update payment status
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
                        courseModules: { include: { courseModuleVideos: true }, orderBy: { id: "asc" } },
                      },
                    },
                  },
                },
              },
            });

            // ✅ Payment successful → initialize progress
            if (event.type === "checkout.session.completed") {
              const userId = updatedOrder.userId;

              for (const item of updatedOrder.items) {
                const course = item.course;

                const firstModule = course.courseModules[0];
                const firstVideo = firstModule?.courseModuleVideos[0];

                if (firstModule && firstVideo) {
                  const existingProgress = await prisma.courseProgress.findFirst({
                    where: { userId, courseId: course.id },
                  });

                  if (!existingProgress) {
                    await prisma.courseProgress.create({
                      data: {
                        userId,
                        courseId: course.id,
                        currentModuleId: firstModule.id,
                        currentVideoId: firstVideo.id,
                        completedVideos: [],
                        completedModules: [],
                        isCompleted: false,
                      },
                    });
                  }
                }
              }
            }
            break;

          default:
            console.warn(`Unknown order type: ${orderType}`);
        }
      } catch (error: any) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update order status: " + error.message);
      }
    }
  }

  return { received: true };
};

export const WebhookServices = {
  handleStripeWebHook,
};
