import { Router } from "express";
import express from "express";
import { WebhookControllers } from "./webhook.controller";

const router = Router()

router.post("/stripe/webhook", express.raw({ type: "application/json" }), WebhookControllers.handleStripeWebHook);


export const WebHookRoutes = router;