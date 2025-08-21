"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const zod_1 = require("zod");
const login = zod_1.z.object({
    body: zod_1.z.object({
        contactNo: zod_1.z.string({
            message: `contactNo is required`,
        }),
        password: zod_1.z.string({
            message: `user password is required`,
        }),
    }),
});
const refreshToken = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            message: `refresh token is required`,
        }),
    }),
});
const changePassword = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            message: `old password is required`,
        }),
        newPassword: zod_1.z.string({
            message: `new password is required`,
        }),
    }),
});
const resetPasswordReq = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            message: `old password is required`,
        }).email({ message: `invalid email address` })
    }),
});
const checkOTPValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            message: `old password is required`,
        }).email({ message: `invalid email address` }),
        otp: zod_1.z.number({ message: "otp is required" }).min(6).max(6),
    }),
});
const resetPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            message: `old password is required`,
        }).email({ message: `invalid email address` }),
        otp: zod_1.z.number({ message: "otp is required" }).min(6).max(6),
        password: zod_1.z.string({ message: `password is required` })
    }),
});
exports.AuthValidator = { login, refreshToken, changePassword, resetPasswordReq, checkOTPValidation, resetPassword };
//# sourceMappingURL=auth.validation.js.map