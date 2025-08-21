import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { OrderCourseServices } from "./orderCourse.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

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
const getMyCourses = catchAsync(async(req,res)=> {
    const user = req.user as JwtPayload;
    const result = await OrderCourseServices.getMyCourseFromDB(user.id);
    sendResponse(res,{
        statusCode: httpStatus.OK, 
        success: true,
        message: "My courses fetched successfully",
        data: result
    })
})
export const OrderCourseControllers = {
    createCourseOrder,
    getMyCourses
}