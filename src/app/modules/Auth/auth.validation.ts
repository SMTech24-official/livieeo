// import { z } from 'zod';

// const login = z.object({
//   body: z.object({
//     contactNo: z.string({
//       message: `contactNo is required`,
//     }),
//     password: z.string({
//       message: `user password is required`,
//     }),
//   }),
// });

// const refreshToken = z.object({
//   cookies: z.object({
//     refreshToken: z.string({
//       message: `refresh token is required`,
//     }),
//   }),
// });

// const changePassword = z.object({
//   body: z.object({
//     oldPassword: z.string({
//       message: `old password is required`,
//     }),
//     newPassword: z.string({
//       message: `new password is required`,
//     }),
//   }),
// });

// const resetPasswordReq = z.object({
//   body: z.object({
//     email: z.string({
//       message: `old password is required`,
//     }).email({message: `invalid email address`})
//   }),
// });


// const checkOTPValidation = z.object({
//   body: z.object({
//     email: z.string({
//       message: `old password is required`,
//     }).email({message: `invalid email address`}),
//     otp: z.number({message: "otp is required"}).min(6).max(6),
//   }),
// })

// const resetPassword = z.object({
//   body: z.object({
//     email: z.string({
//       message: `old password is required`,
//     }).email({message: `invalid email address`}),
//     otp: z.number({message: "otp is required"}).min(6).max(6),
//     password: z.string({message: `password is required`})
//   }),
// })

// export const AuthValidator = { login, refreshToken, changePassword, resetPasswordReq, checkOTPValidation,resetPassword };


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
const resetPassword = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email"),
    otp: z.string({ message: "OTP is required" }).length(6, "OTP must be 6 digits"),
    newPassword: z.string({ message: "New password is required" }),
  }),
});

export const AuthValidator = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
