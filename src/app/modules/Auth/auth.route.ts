// import { Router } from "express";
// import auth from "../../middlewares/auth";
// import { UserRole } from "@prisma/client";
// import { AuthControllers } from "./auth.controller";

// const router = Router();

// router.post("/login", AuthControllers.loginUser);
// router.post("/refresh-token", AuthControllers.refreshToken);
// router.post(
//   "/change-password",
//   auth(UserRole.USER,UserRole.ADMIN),
//   AuthControllers.changePassword
// );
// router.post("/forgot-password", AuthControllers.forgotPassword);
// router.post("/reset-password", AuthControllers.resetPassword);
// export const AuthRoutes = router;

import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AuthControllers } from "./auth.controller";
import { AuthValidator } from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

// login
router.post("/login", validateRequest(AuthValidator.login), AuthControllers.loginUser);

// refresh token
router.post("/refresh-token", validateRequest(AuthValidator.refreshToken), AuthControllers.refreshToken);

// change password (must be logged in)
router.post(
  "/change-password",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(AuthValidator.changePassword),
  AuthControllers.changePassword
);

// forgot password (send OTP)
router.post(
  "/forgot-password",
  validateRequest(AuthValidator.forgotPassword),
  AuthControllers.forgotPassword
);

// verify OTP
router.post(
  "/verify-otp",
  validateRequest(AuthValidator.verifyOtp),
  AuthControllers.verifyOtp
);

// reset password (with OTP)
router.post(
  "/reset-password",
  validateRequest(AuthValidator.resetPassword),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
