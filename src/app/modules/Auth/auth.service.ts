// import { UserStatus } from "@prisma/client";
// import prisma from "../../../shared/prisma";
// import bcrypt from "bcrypt";
// import config from "../../../config";
// import { Secret } from "jsonwebtoken";
// import statusCode from "http-status";
// import httpStatus from "http-status";
// import ApiError from "../../../errors/ApiError";
// import { JWTHelpers } from "../../../helpers/jwtHelper";
// import emailSender from "./emailSender";

// const loginUser = async (payload: { email: string; password: string }) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: payload.email,
//       status: UserStatus.ACTIVE,
//     },
//   });
//   const isCorresctPassword: boolean = await bcrypt.compare(
//     payload.password,
//     userData.password
//   );
//   if (!isCorresctPassword) {
//     throw new ApiError(statusCode.UNAUTHORIZED, "Incorrect password");
//   }
//   const accessToken = JWTHelpers.generateToken(
//     { 
//       id: userData.id,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.access_secret as Secret,
//     config.jwt.access_expires_in as string
//   );
//   const refreshToken = JWTHelpers.generateToken(
//     {
//       id: userData.id,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.refresh_secret as Secret,
//     config.jwt.refresh_expires_in as string
//   );
//   return {
//     accessToken,
//     refreshToken,
//     // needPasswordChange: userData.needPasswordChange,
//   };
// };

// const refreshToken = async (token: string) => {
//   let decodedData;
//   try {
//     decodedData = JWTHelpers.verifyToken(
//       token,
//       config.jwt.refresh_secret as string
//     );
//   } catch (err) {
//     throw new ApiError(statusCode.UNAUTHORIZED, "You are not authorized !");
//   }
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: decodedData.email,
//       status: UserStatus.ACTIVE,
//     },
//   });
//   const accessToken = JWTHelpers.generateToken(
//     {
//       id: userData.id,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.access_secret as Secret,
//     config.jwt.access_expires_in as string
//   );
//   return {
//     accessToken,
//     // needPasswordChange: userData.needPasswordChange,
//   };
// };
// const changePassword = async (user: any, payload: any) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: user.email,
//       status: UserStatus.ACTIVE,
//     },
//   });
//   const isCorrectPassword: boolean = await bcrypt.compare(
//     payload.oldPassword,
//     userData.password
//   );
//   if (!isCorrectPassword) {
//     throw new ApiError(statusCode.UNAUTHORIZED, "Incorrect password !");
//   }
//   const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
//   await prisma.user.update({
//     where: {
//       email: userData.email,
//     },
//     data: {
//       password: hashedPassword,
//       // needPasswordChange: false,
//     },
//   });
//   return {
//     message: "Password changed successfully!",
//   };
// };

// const forgotPassword = async (payload: { email: string }) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: payload.email,
//       status: UserStatus.ACTIVE,
//     },
//   });
//   const resetPassToken = JWTHelpers.generateToken(
//     {
//       id: userData.id,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.reset_pass_secret as Secret,
//     config.jwt.reset_pass_expires_in as string
//   );
//   const resetPassLink =
//     config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
//   await emailSender(
//     userData.email,
//     "Reset Password Link",
//     `
//         <div>
//             <p>Dear User,</p>
//             <p>Your password reset link 
//                 <a href=${resetPassLink}>
//                     <button>
//                         Reset Password
//                     </button>
//                 </a>
//             </p>
//         </div>
//         `
//   );
// };
// const resetPassword = async (
//   token: string,
//   payload: { id: string; password: string }
// ) => {
//   await prisma.user.findUniqueOrThrow({
//     where: {
//       id: payload.id,
//       status: UserStatus.ACTIVE,
//     },
//   });
//   const isValidToken = JWTHelpers.verifyToken(
//     token,
//     config.jwt.reset_pass_secret as Secret
//   );
//   if (!isValidToken) {
//     throw new ApiError(httpStatus.FORBIDDEN, "Forbidden access");
//   }
//   // hash password
//   const password = await bcrypt.hash(payload.password, 12);
//   // update into database
//   await prisma.user.update({
//     where: {
//       id: payload.id,
//     },
//     data: {
//       password,
//     },
//   });
// };
// export const AuthServices = {
//   loginUser,
//   refreshToken,
//   changePassword,
//   forgotPassword,
//   resetPassword,
// };


import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { JWTHelpers } from "../../../helpers/jwtHelper";
import emailSender from "./emailSender";

// ================= LOGIN =================
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

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

  return { accessToken, refreshToken };
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
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password !");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

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
    `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`
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
