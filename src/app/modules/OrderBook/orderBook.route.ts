import { Router } from "express";
import { OrderBookControllers } from "./orderBook.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import express from 'express'

const router = Router()

router.post("/create",auth(UserRole.USER), OrderBookControllers.createBookOrder)
router.post("/stripe/webhook", express.raw({ type: "application/json" }), OrderBookControllers.handleStripeWebHook);


export const OrderBookRoutes = router