import { Router } from "express";
import { SubscriptionControllers } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/create/:planId",auth(UserRole.USER), SubscriptionControllers.createSubscription)
router.get("/",auth(UserRole.ADMIN), SubscriptionControllers.getAllSubscriptions)
router.patch("/connect-subscription/:subscriptionId",auth(UserRole.ADMIN), SubscriptionControllers.connectSubscription)
router.get("/my-subscription",auth(UserRole.USER), SubscriptionControllers.getMySubscription)

export const SubscriptionRoutes = router