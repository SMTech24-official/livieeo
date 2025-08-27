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

    console.log("event ========> ", event);

    if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.expired"
    ) {
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
                            },
                        });
                        
                        break;

                    case "COURSE":
                        await prisma.orderCourse.update({
                            where: { id: orderId },
                            data: {
                                paymentStatus:
                                    event.type === "checkout.session.completed"
                                        ? PaymentStatus.PAID
                                        : PaymentStatus.CANCELED,
                            },
                        });
                        break;

                    default:
                        console.warn(`Unknown order type: ${orderType}`);
                }
            } catch (error) {
                throw new ApiError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to update order status"
                );
            }
        }
    }

    return { received: true };
};


export const WebhookServices = {
    handleStripeWebHook
}
