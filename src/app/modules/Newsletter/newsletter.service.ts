import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from 'http-status'
import emailSender from "../Auth/emailSender";
import { Newsletter } from "@prisma/client";

const subscribeNewsletter = async (payload: Newsletter,user: JwtPayload) => {
    console.log("user service", user)
    const existSubscribe = await prisma.newsletter.findUnique({
        where: {
            email: user.email
        }
    })
    if (existSubscribe) {
        throw new ApiError(httpStatus.CONFLICT, "You are already subscribe")
    }
    const result = await prisma.newsletter.create({
        data: payload
    })
    await emailSender(
    user.email,
    "Newsletter Subscription",
    `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Newsletter Subscription</title>
<style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f7fa;
        color: #333333;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
        background-color: #4f46e5; /* Indigo-600 */
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
    .content {
        padding: 30px 20px;
        line-height: 1.6;
        font-size: 16px;
    }
    .content p {
        margin: 15px 0;
    }
    .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
    }
    .footer {
        background-color: #f5f7fa;
        color: #888888;
        text-align: center;
        padding: 15px;
        font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
        .container {
            margin: 20px;
        }
        .header {
            font-size: 20px;
        }
        .content {
            font-size: 15px;
        }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        Welcome to Our Newsletter
    </div>
    <div class="content">
        <p>Hi ${user.firstName},</p>
        <p>Thank you for subscribing to our newsletter! We're excited to have you onboard.</p>
        <p>You'll now receive the latest updates, tips, and exclusive offers directly in your inbox.</p>
    </div>
    <div class="footer">
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </div>
</div>
</body>
</html>
`
);
    return result
}

export const NewsletterServices = {
    subscribeNewsletter
}