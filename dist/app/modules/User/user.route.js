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
const router = (0, express_1.Router)();
router.post("/register", fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, user_controller_1.UserController.registerUser);
router.post("/create-admin", fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, user_controller_1.UserController.createAdmin);
router.get("/", user_controller_1.UserController.getAllUser);
router.get("/:userId", user_controller_1.UserController.getUserById);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map