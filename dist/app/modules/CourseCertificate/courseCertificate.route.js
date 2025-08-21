"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCertificateRoutes = void 0;
const express_1 = require("express");
const courseCertificate_controller_1 = require("./courseCertificate.controller");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, courseCertificate_controller_1.CourseCertificateControllers.createCourseCertificate);
exports.CourseCertificateRoutes = router;
//# sourceMappingURL=courseCertificate.route.js.map