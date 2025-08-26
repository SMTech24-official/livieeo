import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OrderCourseServices } from "./orderCourse.service";

const createCourseOrder = catchAsync(async(req,res)=> {
    const payload = req.body;
    const user = req.user as JwtPayload;
    const result = await OrderCourseServices.createCourseOrderIntoDB(payload, user);
    sendResponse(res,{
        statusCode: httpStatus.CREATED, 
        success: true,
        message: "Course order created successfully",
        data: result
    })
})
const getAllOrderedCourses = catchAsync(async(req,res)=> {
    const result = await OrderCourseServices.getAllOrderedCoursesFromDB(req.query);
    sendResponse(res,{
        statusCode: httpStatus.CREATED, 
        success: true,
        message: "Ordered courses retrieved successfully",
        data: result
    })
})
const getMyOrderedCourses = catchAsync(async(req,res)=> {
    const user = req.user as JwtPayload;
    const result = await OrderCourseServices.getMyOrderedCoursesFromDB(req.query,user.email);
    sendResponse(res,{
        statusCode: httpStatus.CREATED, 
        success: true,
        message: "My Ordered courses retrieved successfully",
        data: result
    })
})
export const OrderCourseControllers = {
    createCourseOrder,
    getAllOrderedCourses,
    getMyOrderedCourses
}