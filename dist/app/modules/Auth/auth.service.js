"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailSender_1 = __importDefault(require("./emailSender"));
// ================= LOGIN =================
const loginUser = async (payload) => {
    try {
        const userData = await prisma_1.default.user.findUniqueOrThrow({
            where: {
                email: payload.email,
                status: client_1.UserStatus.ACTIVE,
            },
        });
        if (!userData.isEmailVerified) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Please verify your email before login");
        }
        const isCorrectPassword = await bcrypt_1.default.compare(payload.password, userData.password);
        if (!isCorrectPassword) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password");
        }
        const accessToken = jwtHelper_1.JWTHelpers.generateToken({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
        }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in || "7d");
        const refreshToken = jwtHelper_1.JWTHelpers.generateToken({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
        }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in || "7d");
        return {
            accessToken,
            refreshToken,
            user: {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                status: userData.status,
                createdAt: userData.createdAt,
            },
        };
    }
    catch (err) {
        console.log(err);
    }
};
// ================= REFRESH TOKEN =================
const refreshToken = async (token) => {
    let decodedData;
    try {
        decodedData = jwtHelper_1.JWTHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized !");
    }
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const accessToken = jwtHelper_1.JWTHelpers.generateToken({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    return { accessToken };
};
// ================= CHANGE PASSWORD =================
const changePassword = async (user, payload) => {
    // ১. ইউজার ডেটা বের করা
    const userData = await prisma_1.default.user.findUnique({
        where: { email: user.email },
    });
    if (!userData || userData.status !== client_1.UserStatus.ACTIVE) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found or inactive!");
    }
    // ২. পুরানো পাসওয়ার্ড চেক করা
    const isCorrectPassword = await bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password!");
    }
    // ৩. নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড ম্যাচ করছে কিনা চেক
    if (payload.newPassword !== payload.confirmPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Passwords do not match!");
    }
    // ৪. নতুন পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    // ৫. ডাটাবেজে আপডেট করা
    await prisma_1.default.user.update({
        where: { email: userData.email },
        data: { password: hashedPassword },
    });
    return { message: "Password changed successfully!" };
};
// ================= FORGOT PASSWORD (Send OTP) =================
const forgotPassword = async (payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const resetPassToken = jwtHelper_1.JWTHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_expires_in);
    const resetPassLink = `${config_1.default.reset_pass_link}/?email=${userData.email}&token=${resetPassToken}`;
    await (0, emailSender_1.default)(userData.email, "Reset Your Password", `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0f2f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
 
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #4f46e5, #6366f1); color: #ffffff; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px;">We received a request to reset your password</p>
      </div>
 
      <!-- Body -->
      <div style="padding: 40px; color: #333333; font-size: 16px; line-height: 1.6;">
        <p>Hi <strong>${userData.firstName}</strong>,</p>
        <p>Click the button below to securely reset your password. This link will expire in <strong>5 minutes</strong>.</p>
 
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetPassLink}"
             style="background: linear-gradient(90deg, #4f46e5, #6366f1);
                    color: #ffffff;
                    padding: 14px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    display: inline-block;
                    transition: all 0.3s;">
            Reset Password
          </a>
        </div>
 
        <p style="font-size: 14px; color: #555555;">
          If the button above doesn’t work, copy and paste this link into your browser:<br>
          <a href="${resetPassLink}" style="color: #4f46e5; word-break: break-all;">${resetPassLink}</a>
        </p>
 
        <p style="font-size: 16px; color: #555555; margin-top: 30px;">Thank you,<br><strong>Livieeo Team</strong></p>
      </div>
 
      <!-- Footer -->
      <div style="background-color: #f0f2f5; color: #888888; padding: 20px; text-align: center; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Livieeo. All rights reserved.<br>
        If you didn't request this, please ignore this email.
      </div>
 
    </div>
  </div>
  `);
};
// ================= RESET PASSWORD (Using Token) =================
const resetPassword = async (payload) => {
    try {
        // Step 1: টোকেন ভেরিফাই করা
        const decoded = jwtHelper_1.JWTHelpers.verifyToken(payload.token, config_1.default.jwt.reset_pass_secret);
        if (!decoded?.email) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or expired token");
        }
        // Step 2: নতুন পাসওয়ার্ড হ্যাশ করা
        const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
        // Step 3: ইউজারের পাসওয়ার্ড আপডেট করা
        await prisma_1.default.user.update({
            where: { email: decoded.email },
            data: { password: hashedPassword },
        });
        return { message: "Password reset successfully" };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Token expired or invalid");
    }
};
// ================= VERIFY OTP =================
const verifyOtp = async (payload) => {
    const token = await prisma_1.default.resetToken.findFirst({
        where: { email: payload.email, otp: payload.otp },
    });
    if (!token) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    }
    if (token.expiresAt < new Date()) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "OTP expired");
    }
    return { message: "OTP verified successfully" };
};
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
};
//# sourceMappingURL=auth.service.js.map