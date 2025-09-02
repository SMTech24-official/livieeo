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

  // generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save OTP in DB with expiry
  await prisma.resetToken.create({
    data: {
      email: userData.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    },
  });

  // send email
  await emailSender(
    userData.email,
    "Password Reset OTP",
    await EmailTemplates.temp1(otp as unknown as number)
  );

  return { message: "OTP sent to email" };
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

// ================= RESET PASSWORD =================
const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const token = await prisma.resetToken.findFirst({
    where: { email: payload.email, otp: payload.otp },
  });

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
  if (token.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { email: payload.email },
    data: { password: hashedPassword },
  });

  // delete OTP after success
  await prisma.resetToken.delete({ where: { id: token.id } });

  return { message: "Password reset successfully" };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
