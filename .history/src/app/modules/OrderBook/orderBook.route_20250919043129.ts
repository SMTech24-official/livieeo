import { Router } from "express";
import { OrderBookControllers } from "./orderBook.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/create",auth(UserRole.USER), OrderBookControllers.createBookOrder)
router.get("/",auth(UserRole.USER), OrderBookControllers.getAllOrderedBooks)
router.get("/my-books",auth(UserRole.USER), OrderBookControllers.getMyOrderedBooks)

export const OrderBookRoutes = router