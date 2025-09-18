import { JwtPayload } from "jsonwebtoken";
import { IFile } from "../../../interfaces/file";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
 
const registerUser = catchAsync(async (req, res) => {
    const file = req.file as IFile;
    const result = await UserServices.registerUserIntoDB(req.body, file);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `User registered successfully`,
        data: result,
    });
})
const resendOtp = catchAsync(async (req, res) => {
    const {email } = req.body
    const result = await UserServices.resendOtp(email);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Otp resend successfully !`,
        data: result,
    });
})
 
const verifyEmail = catchAsync(async (req, res) => {
    const { code , email} = req.body;
    const result = await UserServices.verifyEmail(email as string, code);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `email verify successfully!`,
        data: result,
    });
})
 
const createAdmin = catchAsync(async (req, res) => {
    const result = await UserServices.createAdminIntoDB(req.body, req.file as IFile);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Admin created successfully`,
        data: result,
    });
})
 
const getAllUser = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUserFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Users retrived successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getAllCustomer = catchAsync(async (req, res) => {
    const result = await UserServices.getAllCustomersFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Customers retrived successfully`,
        meta: result.meta,
        data: result.data,
    });
})
const getCustomerById = catchAsync(async (req, res) => {
    // const { userId } = req.params
    const user = req.user as JwtPayload
    const result = await UserServices.getCustomerByIdFromDB(user.id as string);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Customer retrived successfully`,
        data: result
    });
})
const getUserById = catchAsync(async (req, res) => {
    const { userId } = req.params
    const result = await UserServices.getUserByIdFromDB(userId as string);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `User retrived successfully`,
        data: result
    });
})
 
const updateProfile = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload
    const file = req.file as IFile;
    const result = await UserServices.updateProfile(req.body, user, file);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
})
const updateUserRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await UserServices.updateUserRole(id as string, role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User is ${role} successfully`,
        data: result,
    });
})
const editAdminSetting = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserServices.editAdminSetting(id as string, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Admin setting updated successfully`,
        data: result,
    });
})
export const UserController = {
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
}
 