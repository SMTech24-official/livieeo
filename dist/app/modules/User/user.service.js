"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../../helpers/queryBuilder"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const userId_1 = require("./userId");
const registerUserIntoDB = async (payload, file) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists");
    }
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 12);
    payload.userId = await (0, userId_1.getNextUserId)();
    payload.password = hashedPassword;
    const result = await prisma_1.default.user.create({
        data: payload,
    });
    return result;
};
const createAdminIntoDB = async (payload, file) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: payload?.email,
        },
    });
    if (user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists");
    }
    if (file) {
        const uploadToCloudinary = await fileUploader_1.fileUploader.uploadToCloudinary(file);
        payload.photoUrl = uploadToCloudinary?.secure_url ?? null;
    }
    payload.userId = await (0, userId_1.getNextAdminId)();
    payload.role = client_1.UserRole.ADMIN;
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 12);
    payload.password = hashedPassword;
    const result = await prisma_1.default.user.create({
        data: payload,
    });
    return result;
};
const getAllUserFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.user, query);
    const users = await queryBuilder
        .range()
        .search(["firstName", "email"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            status: 'ACTIVE',
            role: client_1.UserRole.USER
        },
        include: {
            education: true,
            socialLinks: true,
            // orders: true
        }
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: users };
};
const getAllAdminFromDB = async (query) => {
    const queryBuilder = new queryBuilder_1.default(prisma_1.default.user, query);
    const users = await queryBuilder
        .range()
        .search(["firstName", "email"])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute({
        where: {
            status: 'ACTIVE',
            role: client_1.UserRole.ADMIN
        },
        include: {
            education: true,
            socialLinks: true,
            orders: true
        }
    });
    const meta = await queryBuilder.countTotal();
    return { meta, data: users };
};
const getUserByIdFromDB = async (id) => {
    const result = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
};
exports.UserServices = {
    registerUserIntoDB,
    createAdminIntoDB,
    getAllUserFromDB,
    getAllAdminFromDB,
    getUserByIdFromDB
};
//# sourceMappingURL=user.service.js.map