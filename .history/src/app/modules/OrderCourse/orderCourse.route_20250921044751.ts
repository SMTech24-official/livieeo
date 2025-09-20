import { Router } from "express"
import auth from "../../middlewares/auth"
import { UserRole } from "@prisma/client"
import { OrderCourseControllers } from "./orderCourse.controller"

const router = Router()

router.post("/create",auth(UserRole.USER), OrderCourseControllers.createCourseOrder)
router.get("/",auth(UserRole.USER,UserRole.ADMIN), OrderCourseControllers.getAllOrderedCourses)
router.get("/my-courses",auth(UserRole.USER), OrderCourseControllers.getMyOrderedCourses)

export const OrderCourseRoutes = router