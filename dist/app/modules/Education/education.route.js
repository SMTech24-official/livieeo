"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationRoutes = void 0;
const express_1 = require("express");
const education_controller_1 = require("./education.controller");
const router = (0, express_1.Router)();
router.post("/create", education_controller_1.EducationControllers.createEducation);
router.patch("/:id", education_controller_1.EducationControllers.updateEducation);
router.delete("/:id", education_controller_1.EducationControllers.deleteEducation);
router.get("/:id", education_controller_1.EducationControllers.getEducationById);
router.get("/", education_controller_1.EducationControllers.getEducations);
exports.EducationRoutes = router;
//# sourceMappingURL=education.route.js.map