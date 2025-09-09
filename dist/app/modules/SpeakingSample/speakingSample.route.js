"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeakingSampleRoutes = void 0;
const express_1 = require("express");
const speakingSample_controllers_1 = require("./speakingSample.controllers");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.single("video"), textToJsonParser_1.default, speakingSample_controllers_1.SpeakingSampleControllers.createSpeakingSample);
router.get("/:speakingSampleId", speakingSample_controllers_1.SpeakingSampleControllers.getSpeakingSampleById);
router.get("/:speakingSampleId", speakingSample_controllers_1.SpeakingSampleControllers.updateSpeakingSample);
router.get("/:speakingSampleId", speakingSample_controllers_1.SpeakingSampleControllers.deleteSpeakingSample);
router.get("/", speakingSample_controllers_1.SpeakingSampleControllers.getAllSpeakingSample);
router.get("/:speakingSampleId/related-speaking-sample", speakingSample_controllers_1.SpeakingSampleControllers.getRelatedSpeakingSample);
exports.SpeakingSampleRoutes = router;
//# sourceMappingURL=speakingSample.route.js.map