"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/register", fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, user_controller_1.UserController.registerUser);
router.post("/verify-email/:userId", user_controller_1.UserController.verifyEmail);
router.post("/create-admin", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, user_controller_1.UserController.createAdmin);
router.get("/", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), user_controller_1.UserController.getAllUser);
router.get("/customers", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAllCustomer);
router.get("/my-info", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), user_controller_1.UserController.getCustomerById);
router.get("/:userId", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), user_controller_1.UserController.getUserById);
router.put("/update-profile", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, user_controller_1.UserController.updateProfile);
router.patch("/update-role/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.updateUserRole);
router.patch("/edit/admin-setting/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.editAdminSetting);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map