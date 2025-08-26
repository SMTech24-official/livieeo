// import catchAsync from "../../../shared/catchAsync";
// import sendResponse from "../../../shared/sendResponse";
// import { AuthServices } from "./auth.service";
// import httpStatus from "http-status";

// const loginUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.loginUser(req.body);
//   const { refreshToken } = result;
//   res.cookie("refreshToken", refreshToken, {
//     secure: false,
//     httpOnly: true,
//   });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Logged in successfully!",
//     data: {
//       accessToken: result.accessToken
//     }
//   });
// });
// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies;
//   const result = await AuthServices.refreshToken(refreshToken);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Refresh token generate successfully!",
//     data: result,
//   });
// });
// const changePassword = catchAsync(async (req, res) => {
//   const user = req.user;
//   const result = await AuthServices.changePassword(user, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Password changed successfully!",
//     data: result,
//   });
// });
// const forgotPassword = catchAsync(async (req, res) => {
//   await AuthServices.forgotPassword(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Check your email !",
//     data: null,
//   });
// });
// const resetPassword = catchAsync(async (req, res) => {
//   const token = req.headers.authorization || "";
//   await AuthServices.resetPassword(token, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Check reset successful !",
//     data: null,
//   });
// });

// export const AuthControllers = {
//   loginUser,
//   refreshToken,
//   changePassword,
//   forgotPassword,
//   resetPassword,
// };

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";

// ================= LOGIN =================
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: { accessToken: result.accessToken },
  });
});

// ================= REFRESH TOKEN =================
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token generated successfully!",
    data: result,
  });
});

// ================= CHANGE PASSWORD =================
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await AuthServices.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully!",
    data: result,
  });
});

// ================= FORGOT PASSWORD (Send OTP) =================
const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email!",
    data: result,
  });
});

// ================= VERIFY OTP =================
const verifyOtp = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOtp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully!",
    data: result,
  });
});

// ================= RESET PASSWORD =================
const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};