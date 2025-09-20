"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSpeakerRoutes = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const bookSpeaker_controller_1 = require("./bookSpeaker.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create-book-speaker", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), textToJsonParser_1.default, bookSpeaker_controller_1.BookSpeakerControllers.createBookSpeaker);
router.get("/", bookSpeaker_controller_1.BookSpeakerControllers.getAllBookSpeaker);
router.get("/:speakerId", bookSpeaker_controller_1.BookSpeakerControllers.getBookSpeakerById);
router.put("/:speakerId", bookSpeaker_controller_1.BookSpeakerControllers.updateBookSpeaker);
router.delete("/:speakerId", bookSpeaker_controller_1.BookSpeakerControllers.deleteBookSpeaker);
exports.BookSpeakerRoutes = router;
//# sourceMappingURL=bookSpeaker.route.js.map