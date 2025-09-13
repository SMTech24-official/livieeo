import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status"
import stripe from "../../../helpers/stripe";
import config from "../../../config";
import { IGenericResponse } from "../../../interfaces/common";
import { Subscription } from "@prisma/client";
import QueryBuilder from "../../../helpers/queryBuilder";

const createSubscriptionIntoDB = async (
  planId: string,
  user: JwtPayload
) => {
  const userId = user.id;

  // 1️⃣ Find plan
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription plan not found!");
  }

  // 2️⃣ check already active subscription
  const activeSub = await prisma.subscription.findFirst({
    where: { userId, planId: plan.id, paymentStatus: "PAID" },
  });

  if (activeSub) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already have this subscription plan."
    );
  }

  // 3️⃣ Create subscription entry
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      paymentStatus: "PENDING",
      paymentMethod: "STRIPE",
      status: "PENDING",
    },
  });

  // 4️⃣ Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name,
            description: plan.description.join(", ") || "Subscription purchase",
          },
          unit_amount: Math.round(plan.discountPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment", // এককালীন পেমেন্ট
    success_url: `${config.stripe.success_url}`,
    cancel_url: `${config.stripe.fail_url}`,
    metadata: {
      orderId: subscription.id,
      orderType: "SUBSCRIPTION",
      userId,
    },
  });

  return {
    subscriptionId: subscription.id,
    paymentUrl: session.url,
  };
};

// ✅ Admin: Get all subscriptions (with query builder)
const getAllSubscriptionsFromDB = async (
  query: Record<string, unknown>
): Promise<IGenericResponse<Subscription[]>> => {
  const queryBuilder = new QueryBuilder(prisma.subscription, query);

  const subscriptions = await queryBuilder
    .search(["status", "paymentStatus"]) // search fields
    .filter(["paymentStatus"]) // filterable fields
    .sort()
    .paginate()
    .fields()
    .execute({
      include: {
        user: true,
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const meta = await queryBuilder.countTotal();

  return { meta, data: subscriptions };
};

// ✅ Admin: Approve/Connect subscription
const connectSubscriptionIntoDB = async (subscriptionId: string) => {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "CONNECTED",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // ধরো ১ মাস
    },
    include: {
      user: true,
      plan: true,
    },
  });
};

// ✅ User: My subscriptions (with query builder)
const getUserSubscriptionsFromDB = async (
  userId: string,
  query: Record<string, unknown>
): Promise<IGenericResponse<Subscription[]>> => {
  const queryBuilder = new QueryBuilder(prisma.subscription, query);

  const subscriptions = await queryBuilder
    .filter(["status", "paymentStatus"]) // user can filter
    .sort()
    .paginate()
    .fields()
    .execute({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

  const meta = await queryBuilder.countTotal();

  return { meta, data: subscriptions };
};

export const SubscriptionServices = {
  createSubscriptionIntoDB,
  getAllSubscriptionsFromDB,
  connectSubscriptionIntoDB,
  getUserSubscriptionsFromDB,
};