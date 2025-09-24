"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const file = req.file;
    const result = await user_service_1.UserServices.registerUserIntoDB(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `User registered successfully`,
        data: result,
    });
});
const resendOtp = (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    const result = await user_service_1.UserServices.resendOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Otp resend successfully !`,
        data: result,
    });
});
const verifyEmail = (0, catchAsync_1.default)(async (req, res) => {
    const { code, email } = req.body;
    const result = await user_service_1.UserServices.verifyEmail(email, code);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `email verify successfully!`,
        data: result,
    });
});
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.createAdminIntoDB(req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Admin created successfully`,
        data: result,
    });
});
const getAllUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUserFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Users retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getAllCustomer = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllCustomersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Customers retrieved successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getCustomerById = (0, catchAsync_1.default)(async (req, res) => {
    // const { userId } = req.params
    const user = req.user;
    const result = await user_service_1.UserServices.getCustomerByIdFromDB(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Customer retrieved successfully`,
        data: result
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.params;
    const result = await user_service_1.UserServices.getUserByIdFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `User retrieved successfully`,
        data: result
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const file = req.file;
    const result = await user_service_1.UserServices.updateProfile(req.body, user, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
const updateUserRole = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await user_service_1.UserServices.updateUserRole(id, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User is ${role} successfully`,
        data: result,
    });
});
const editAdminSetting = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.editAdminSetting(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Admin setting updated successfully`,
        data: result,
    });
});
exports.UserController = {
    registerUser,
    getAllUser,
    createAdmin,
    getCustomerById,
    getUserById,
    getAllCustomer,
    updateProfile,
    updateUserRole,
    editAdminSetting,
    verifyEmail,
    resendOtp
};
//# sourceMappingURL=user.controller.js.map