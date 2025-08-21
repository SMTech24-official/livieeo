"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken
        }
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_service_1.AuthServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Refresh token generate successfully!",
        data: result,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthServices.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password changed successfully!",
        data: result,
    });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    await auth_service_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Check your email !",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.headers.authorization || "";
    await auth_service_1.AuthServices.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Check reset successful !",
        data: null,
    });
});
exports.AuthControllers = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
//# sourceMappingURL=auth.controller.js.map