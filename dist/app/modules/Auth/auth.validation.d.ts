import { z } from "zod";
export declare const AuthValidator: {
    login: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    refreshToken: z.ZodObject<{
        cookies: z.ZodObject<{
            refreshToken: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    changePassword: z.ZodObject<{
        body: z.ZodObject<{
            oldPassword: z.ZodString;
            newPassword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    forgotPassword: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    verifyOtp: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            otp: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    resetPasswordValidation: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
            newPassword: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=auth.validation.d.ts.map