import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { JWTHelpers } from "../../../helpers/jwtHelper";
import emailSender from "./emailSender";
import { EmailTemplates } from "./emailTemplates";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ================= LOGIN =================
const loginUser = async (payload: { email: string; password: string }) => {
  // 1) ইমেইল দিয়ে ইউজার খোঁজা
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // 2) পাসওয়ার্ড চেক করা
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  // 3) Access Token বানানো
  const accessToken = JWTHelpers.generateToken(
    {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string
  );

  // 4) Refresh Token বানানো
  const refreshToken = JWTHelpers.generateToken(
    {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  // 5) টোকেন + ইউজার ডেটা রিটার্ন করা
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
};

// ================= REFRESH TOKEN =================
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = JWTHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string
    );
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = JWTHelpers.generateToken(
    {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string
  );

  return { accessToken };
};

// ================= CHANGE PASSWORD =================
const changePassword = async (user: JwtPayload, payload: ChangePasswordPayload) => {
  // ১. ইউজার ডেটা বের করা
  const userData = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!userData || userData.status !== UserStatus.ACTIVE) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found or inactive!");
  }

  // ২. পুরানো পাসওয়ার্ড চেক করা
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password!");
  }

  // ৩. নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড ম্যাচ করছে কিনা চেক
  if (payload.newPassword !== payload.confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match!");
  }

  // ৪. নতুন পাসওয়ার্ড হ্যাশ করা
  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  // ৫. ডাটাবেজে আপডেট করা
  await prisma.user.update({
    where: { email: userData.email },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully!" };
};

// ================= FORGOT PASSWORD (Send OTP) =================

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const resetPassToken = JWTHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_expires_in as string
  );
  const resetPassLink =
    `${config.reset_pass_link}/?email=${userData.email}&token=${resetPassToken}`;
  await emailSender(
    userData.email,
    "Reset Your Password",
    `
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
  `
  );
};
// ================= RESET PASSWORD (Using Token) =================
const resetPassword = async (payload: { token: string; newPassword: string }) => {
  try {
    // Step 1: টোকেন ভেরিফাই করা
    const decoded = JWTHelpers.verifyToken(
      payload.token,
      config.jwt.reset_pass_secret as Secret
    ) as { email: string; role: string };

    if (!decoded?.email) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired token");
    }

    // Step 2: নতুন পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    // Step 3: ইউজারের পাসওয়ার্ড আপডেট করা
    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    return { message: "Password reset successfully" };
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token expired or invalid");
  }
};
// ================= VERIFY OTP =================
const verifyOtp = async (payload: { email: string; otp: string }) => {
  const token = await prisma.resetToken.findFirst({
    where: { email: payload.email, otp: payload.otp },
  });

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (token.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  return { message: "OTP verified successfully" };
};



export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
