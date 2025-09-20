"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleRoutes = void 0;
const express_1 = require("express");
const courseModule_controller_1 = require("./courseModule.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), courseModule_controller_1.CourseModuleControllers.createCourseModule);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), courseModule_controller_1.CourseModuleControllers.getCourseModuleById);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), courseModule_controller_1.CourseModuleControllers.getAllCourseModules);
exports.CourseModuleRoutes = router;
//# sourceMappingURL=courseModule.route.js.map