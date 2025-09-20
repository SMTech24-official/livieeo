import { JwtPayload } from "jsonwebtoken";
interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export declare const AuthServices: {
    loginUser: (payload: {
        email: string;
        password: string;
    }) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string | null;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
    } | undefined>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    changePassword: (user: JwtPayload, payload: ChangePasswordPayload) => Promise<{
        message: string;
    }>;
    forgotPassword: (payload: {
        email: string;
    }) => Promise<void>;
    verifyOtp: (payload: {
        email: string;
        otp: string;
    }) => Promise<{
        message: string;
    }>;
    resetPassword: (payload: {
        token: string;
        newPassword: string;
    }) => Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map