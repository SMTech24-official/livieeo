export declare const AuthServices: {
    loginUser: (payload: {
        email: string;
        password: string;
    }) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    changePassword: (user: any, payload: any) => Promise<{
        message: string;
    }>;
    forgotPassword: (payload: {
        email: string;
    }) => Promise<void>;
    resetPassword: (token: string, payload: {
        id: string;
        password: string;
    }) => Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map