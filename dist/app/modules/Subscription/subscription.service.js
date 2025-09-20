"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("../../../helpers/stripe"));
const config_1 = __importDefault(require("../../../config"));
const client_1 = require("@prisma/client");
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const createSubscriptionIntoDB = async (planId, user) => {
    const userId = user.id;
    // 1️⃣ Find plan
    const plan = await prisma_1.default.subscriptionPlan.findUnique({
        where: { id: planId },
    });
    if (!plan) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Subscription plan not found!");
    }
    // 2️⃣ check already active subscription
    const activeSub = await prisma_1.default.subscription.findFirst({
        where: { userId, planId: plan.id, paymentStatus: "PAID" },
    });
    if (activeSub) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You already have this subscription plan.");
    }
    // 3️⃣ Create subscription entry
    const subscription = await prisma_1.default.subscription.create({
        data: {
            userId,
            planId: plan.id,
            paymentStatus: "PENDING",
            paymentMethod: "STRIPE",
            status: "PENDING",
        },
    });
    // 4️⃣ Stripe checkout session
    const session = await stripe_1.default.checkout.sessions.create({
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
        success_url: `${config_1.default.stripe.success_url}`,
        cancel_url: `${config_1.default.stripe.fail_url}`,
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
const getAllSubscriptionsFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.subscription, query);
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
const connectSubscriptionIntoDB = async (subscriptionId) => {
    return prisma_1.default.subscription.update({
        where: { id: subscriptionId },
        data: {
            status: "CONNECTED",
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
        include: {
            user: true,
            plan: true,
        },
    });
};
const getMySubscriptionFromDB = async (userId, query) => {
    console.log("userId", userId);
    // 👇 QueryBuilder দিয়ে Payment History আনবো
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.subscription, query);
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
    const activeSubscription = await prisma_1.default.subscription.findFirst({
        where: { userId, status: client_1.SubscriptionStatus.CONNECTED },
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
            history: paymentHistory.map((sub) => ({
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
exports.SubscriptionServices = {
    createSubscriptionIntoDB,
    getAllSubscriptionsFromDB,
    connectSubscriptionIntoDB,
    getMySubscriptionFromDB,
};
//# sourceMappingURL=subscription.service.js.map