import { ca } from "zod/v4/locales";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DashboardServices } from "./dashboard.service";
import httpStatus from 'http-status'

const totalRevenue = catchAsync(async(req,res)=> {
    const result = await DashboardServices.totalRevenue()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Total revenue retrieved successfully",
        data: result
    })
})

const bookSalesCount = catchAsync(async(req,res)=> {
    const result = await DashboardServices.bookSalesCount()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Book sales count retrieved successfully",
        data: result
    })
})

const courseEnrollments = catchAsync(async(req,res)=> {
    const result = await DashboardServices.courseEnrollments()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Course enrollments retrieved successfully",
        data: result
    })
})

const speakingInquires = catchAsync(async(req,res)=> {
    const result = await DashboardServices.speakingInquires()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Speaking inquiries retrieved successfully",
        data: result
    })
})

const newMemberOfThisMonth = catchAsync(async(req,res)=> {
    const result = await DashboardServices.newMemberOfThisMonth()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "New members of this month retrieved successfully",
        data: result
    })
})

const webVisitorOfThisMonth = catchAsync(async(req,res)=> {
    const result = await DashboardServices.webVisitorOfThisMonth()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Web visitors of this month retrieved successfully",
        data: result
    })
})

const getRecentActivities = catchAsync(async(req,res)=> {
    const result = await DashboardServices.getRecentActivities()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Recent activities retrieved successfully",
        data: result
    })
})
const getTopSellingBooks = catchAsync(async(req,res)=> {
    const result = await DashboardServices.getTopSellingBooks()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Top selling books retrieved successfully",
        data: result
    })
})
const getTopSellingCourses = catchAsync(async(req,res)=> {
    const result = await DashboardServices.getTopSellingCourses()
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "Top selling courses retrieved successfully",
        data: result
    })
})

export const DashboardControllers = {
    totalRevenue,
    bookSalesCount,
    courseEnrollments,
    speakingInquires,
    newMemberOfThisMonth,
    webVisitorOfThisMonth,
    getRecentActivities,
    getTopSellingBooks,
    getTopSellingCourses
}