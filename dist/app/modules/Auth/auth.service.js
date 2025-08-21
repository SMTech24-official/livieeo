"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const http_status_1 = __importDefault(require("http-status"));
const http_status_2 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = async (payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorresctPassword = await bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorresctPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password");
    }
    const accessToken = jwtHelper_1.JWTHelpers.generateToken({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    const refreshToken = jwtHelper_1.JWTHelpers.generateToken({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        // needPasswordChange: userData.needPasswordChange,
    };
};
const refreshToken = async (token) => {
    let decodedData;
    try {
        decodedData = jwtHelper_1.JWTHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized !");
    }
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const accessToken = jwtHelper_1.JWTHelpers.generateToken({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.access_secret, config_1.default.jwt.access_expires_in);
    return {
        accessToken,
        // needPasswordChange: userData.needPasswordChange,
    };
};
const changePassword = async (user, payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = await bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect password !");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    await prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
            // needPasswordChange: false,
        },
    });
    return {
        message: "Password changed successfully!",
    };
};
const forgotPassword = async (payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const resetPassToken = jwtHelper_1.JWTHelpers.generateToken({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_expires_in);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    await (0, emailSender_1.default)(userData.email, "Reset Password Link", `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>
        </div>
        `);
};
const resetPassword = async (token, payload) => {
    await prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isValidToken = jwtHelper_1.JWTHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_2.default.FORBIDDEN, "Forbidden access");
    }
    // hash password
    const password = await bcrypt_1.default.hash(payload.password, 12);
    // update into database
    await prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
};
exports.AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
//# sourceMappingURL=auth.service.js.map