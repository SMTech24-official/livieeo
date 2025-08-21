import { Router } from "express";
import { OrderBookControllers } from "./orderBook.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.post("/create",auth(UserRole.USER), OrderBookControllers.createBookOrder)
router.get("/my-books", auth(UserRole.USER), OrderBookControllers.getMyBooks);


export const OrderBookRoutes = router