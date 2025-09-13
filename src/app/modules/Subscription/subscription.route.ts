import { Router } from "express";
import { SubscriptionControllers } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/create/:planId",auth(UserRole.USER), SubscriptionControllers.createSubscription)

export const SubscriptionRoutes = router