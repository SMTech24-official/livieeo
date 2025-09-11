import { z } from "zod";

// login validation
const login = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email"),
    password: z.string({ message: "Password is required" }),
  }),
});

// refresh token validation
const refreshToken = z.object({
  cookies: z.object({
    refreshToken: z.string({ message: "Refresh token is required" }),
  }),
});

// change password validation
const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({ message: "Old password is required" }),
    newPassword: z.string({ message: "New password is required" }),
  }),
});

// forgot password (email required)
const forgotPassword = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email"),
  }),
});

// verify OTP validation
const verifyOtp = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email"),
    otp: z.string({ message: "OTP is required" }).length(6, "OTP must be 6 digits"),
  }),
});

// reset password validation
const resetPasswordValidation = z.object({
  body: z.object({
    token: z.string({ message: "Token is required" }),
    newPassword: z.string({ message: "New Password is required" }),
  }),
});

export const AuthValidator = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPasswordValidation,
};
