"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const zod_1 = require("zod");
// login validation
const login = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email"),
        password: zod_1.z.string({ message: "Password is required" }),
    }),
});
// refresh token validation
const refreshToken = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ message: "Refresh token is required" }),
    }),
});
// change password validation
const changePassword = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ message: "Old password is required" }),
        newPassword: zod_1.z.string({ message: "New password is required" }),
    }),
});
// forgot password (email required)
const forgotPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email"),
    }),
});
// verify OTP validation
const verifyOtp = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email"),
        otp: zod_1.z.string({ message: "OTP is required" }).length(6, "OTP must be 6 digits"),
    }),
});
// reset password validation
const resetPasswordValidation = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string({ message: "Token is required" }),
        newPassword: zod_1.z.string({ message: "New Password is required" }),
    }),
});
exports.AuthValidator = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPasswordValidation,
};
//# sourceMappingURL=auth.validation.js.map