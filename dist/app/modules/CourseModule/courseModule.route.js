"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModuleRoutes = void 0;
const express_1 = require("express");
const courseModule_controller_1 = require("./courseModule.controller");
const router = (0, express_1.Router)();
router.post("/create", courseModule_controller_1.CourseModuleControllers.createCourseModule);
router.get("/:id", courseModule_controller_1.CourseModuleControllers.getCourseModuleById);
router.get("/", courseModule_controller_1.CourseModuleControllers.getAllCourseModules);
exports.CourseModuleRoutes = router;
//# sourceMappingURL=courseModule.route.js.map