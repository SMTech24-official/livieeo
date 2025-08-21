"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../../helpers/fileUploader");
const textToJsonParser_1 = __importDefault(require("../../middlewares/textToJsonParser"));
const blog_controller_1 = require("./blog.controller");
const router = (0, express_1.Router)();
router.post("/create", fileUploader_1.fileUploader.upload.array("blogImages", 5), textToJsonParser_1.default, blog_controller_1.BlogControllers.createBlog);
router.get("/", blog_controller_1.BlogControllers.getAllBlogs);
router.patch("/:id", fileUploader_1.fileUploader.upload.array("blogImages", 5), textToJsonParser_1.default, blog_controller_1.BlogControllers.updateBlog);
router.delete("/:id", blog_controller_1.BlogControllers.deleteBlog);
router.patch("/published-status/:id", textToJsonParser_1.default, blog_controller_1.BlogControllers.updatePublishedStatus);
exports.BlogRoutes = router;
//# sourceMappingURL=blog.route.js.map