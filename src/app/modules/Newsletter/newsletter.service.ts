import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from 'http-status'
import emailSender from "../Auth/emailSender";

const subscribeNewsletter = async (user: JwtPayload) => {
    const existSubscribe = await prisma.newsletter.findUnique({
        where: {
            email: user.email
        }
    })
    if (existSubscribe) {
        throw new ApiError(httpStatus.CONFLICT, "You are already subscribe")
    }
    const subscribedUserData = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
    }
    const result = await prisma.newsletter.create({
        data: subscribedUserData
    })
    await emailSender(
        user.email,
        "Newsletter Subscription",
        `
        <h2>Welcome to our Newsletter!</h2>
        <p>Thanks for subscribing. You'll now receive regular updates from us.</p>
        `
    )
    return result
}

export const NewsletterServices = {
    subscribeNewsletter
}