import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import stripe from "../../../helpers/stripe";
import config from "../../../config";
import { IGenericResponse } from "../../../interfaces/common";
import {
  SubscriptionName,
  Subscription,
  SubscriptionStatus,
} from "@prisma/client";
import QueryBuilder from "../../../helpers/queryBuilder";

type IMySubscriptionResponse = {
  overview: {
    planName: string;
    price: number;
    sessions: number;
    nextBillingDate: Date | null;
  } | null;
  history: {
    id: string;
    date: Date;
    planName: string;
    paymentMethod: string;
    status: string;
    amount: number;
    transactionId: string | null;
  }[];
};

const createSubscriptionIntoDB = async (planName: string, user: JwtPayload) => {
  const userId = user.id;

  if (!["BASIC", "PREMIUM", "PLATINUM"].includes(planName.toUpperCase())) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid Subscription Plan provided"
    );
  }

  // 1️⃣ Find plan
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { name: planName.toUpperCase() as SubscriptionName },
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
  const queryBuilder = new QueryBuilder(prisma.subscription, {});

  const extraQuery: Record<string, any> = {};
  if (query.status) {
    extraQuery["status"] = {
      equals: (query.status as string).toUpperCase(),
    };

    if (
      !["PENDING", "COMPLETED", "CANCELED"].includes(
        extraQuery["status"].equals
      )
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid Status. Supported: `PENDING`, `COMPLETED`, `CANCELED`"
      );
    }
  }

  const subscriptions = await queryBuilder
    .search(["status", "paymentStatus"]) // search fields
    .filter(["paymentStatus"]) // filterable fields
    .sort()
    .paginate()
    .fields()
    .execute({
      where: extraQuery,
      include: {
        user: true,
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const meta = await queryBuilder.rawFilter(extraQuery).countTotal();

  return { meta, data: subscriptions };
};

// ✅ Admin: Approve/Connect subscription
const connectSubscriptionIntoDB = async (subscriptionId: string) => {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "COMPLETED",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    include: {
      user: true,
      plan: true,
    },
  });
};

const getMySubscriptionFromDB = async (
  userId: string,
  query: Record<string, unknown>
): Promise<IGenericResponse<IMySubscriptionResponse>> => {
  console.log("userId", userId);

  // 👇 QueryBuilder দিয়ে Payment History আনবো
  const queryBuilder = new QueryBuilder(prisma.subscription, query);

  const paymentHistory = await queryBuilder
    .filter(["paymentStatus", "paymentMethod"])
    .sort()
    .paginate()
    .fields()
    .execute({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

  const meta = await queryBuilder.countTotal();

  // 👇 Active subscription আলাদাভাবে আনবো
  const activeSubscription = await prisma.subscription.findFirst({
    where: { userId, status: SubscriptionStatus.COMPLETED },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  // 👇 Final Response
  return {
    meta,
    data: {
      overview: activeSubscription
        ? {
            planName: activeSubscription.plan.name,
            price: activeSubscription.plan.price,
            sessions: activeSubscription.plan.sessions,
            nextBillingDate: activeSubscription.endDate,
          }
        : null,
      history: paymentHistory.map((sub: any) => ({
        id: sub.id,
        date: sub.createdAt,
        planName: sub.plan.name,
        paymentMethod: sub.paymentMethod,
        status: sub.paymentStatus,
        amount: sub.plan.price,
        transactionId: sub.transactionId,
      })),
    },
  };
};

export const SubscriptionServices = {
  createSubscriptionIntoDB,
  getAllSubscriptionsFromDB,
  connectSubscriptionIntoDB,
  getMySubscriptionFromDB,
};
