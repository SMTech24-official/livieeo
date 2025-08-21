"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const file = req.file;
    const result = await user_service_1.UserServices.registerUserIntoDB(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `User registered successfully`,
        data: result,
    });
});
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.createAdminIntoDB(req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Admin created successfully`,
        data: result,
    });
});
const getAllUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUserFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `Users retrived successfully`,
        meta: result.meta,
        data: result.data,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.params;
    const result = await user_service_1.UserServices.getUserByIdFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `User retrived successfully`,
        data: result
    });
});
exports.UserController = {
    registerUser,
    getAllUser,
    createAdmin,
    getUserById
};
//# sourceMappingURL=user.controller.js.map