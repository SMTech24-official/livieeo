"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateRoutes = void 0;
const express_1 = require("express");
const courseCertificate_controller_1 = require("./courseCertificate.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// সার্টিফিকেট ইস্যু (শুধু যাদের কোর্স পেইড আছে তাদের)
router.post("/issue", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), courseCertificate_controller_1.CourseCertificateControllers.createCourseCertificate);
// সার্টিফিকেট ভেরিফিকেশন (পাবলিক লিংক)
router.get("/verify/:code", courseCertificate_controller_1.CourseCertificateControllers.verifyCourseCertificate);
// ইউজারের নিজের সার্টিফিকেট লিস্ট
router.get("/my-certificates", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), courseCertificate_controller_1.CourseCertificateControllers.getMyCertificates);
exports.CourseCertificateRoutes = router;
//# sourceMappingURL=courseCertificate.route.js.map