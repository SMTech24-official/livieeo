import { Router } from "express"
import auth from "../../middlewares/auth"
import { UserRole } from "@prisma/client"
import { OrderCourseControllers } from "./orderCourse.controller"

const router = Router()

router.post("/create",auth(UserRole.USER), OrderCourseControllers.createCourseOrder)

export const OrderCourseRoutes = router