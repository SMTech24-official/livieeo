"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const dashboard_service_1 = require("./dashboard.service");
const http_status_1 = __importDefault(require("http-status"));
const dashboardStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardServices.dashboardStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard stats retrieved successfully",
        data: result
    });
});
// const bookSalesCount = catchAsync(async(req,res)=> {
//     const result = await DashboardServices.bookSalesCount()
//     sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Book sales count retrieved successfully",
//         data: result
//     })
// })
// const courseEnrollments = catchAsync(async(req,res)=> {
//     const result = await DashboardServices.courseEnrollments()
//     sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Course enrollments retrieved successfully",
//         data: result
//     })
// })
// const speakingInquires = catchAsync(async(req,res)=> {
//     const result = await DashboardServices.speakingInquires()
//     sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Speaking inquiries retrieved successfully",
//         data: result
//     })
// })
// const newMemberOfThisMonth = catchAsync(async(req,res)=> {
//     const result = await DashboardServices.newMemberOfThisMonth()
//     sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "New members of this month retrieved successfully",
//         data: result
//     })
// })
// const webVisitorOfThisMonth = catchAsync(async(req,res)=> {
//     const result = await DashboardServices.webVisitorOfThisMonth()
//     sendResponse(res,{
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Web visitors of this month retrieved successfully",
//         data: result
//     })
// })
const getRecentActivities = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardServices.getRecentActivities();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Recent activities retrieved successfully",
        data: result
    });
});
const getTopSellingBooks = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardServices.getTopSellingBooks();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Top selling books retrieved successfully",
        data: result
    });
});
const getTopSellingCourses = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.DashboardServices.getTopSellingCourses();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Top selling courses retrieved successfully",
        data: result
    });
});
exports.DashboardControllers = {
    // totalRevenue,
    // bookSalesCount,
    // courseEnrollments,
    // speakingInquires,
    // newMemberOfThisMonth,
    // webVisitorOfThisMonth,
    dashboardStats,
    getRecentActivities,
    getTopSellingBooks,
    getTopSellingCourses
};
//# sourceMappingURL=dashboard.controller.js.map