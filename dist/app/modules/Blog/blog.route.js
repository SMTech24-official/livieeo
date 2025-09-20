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
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.array("blogImages", 5), textToJsonParser_1.default, blog_controller_1.BlogControllers.createBlog);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogControllers.getAllBlogs);
router.get("/published-blogs", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), blog_controller_1.BlogControllers.getPublishedBlogs);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.array("blogImages", 5), textToJsonParser_1.default, blog_controller_1.BlogControllers.updateBlog);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogControllers.deleteBlog);
router.patch("/published-status/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), textToJsonParser_1.default, blog_controller_1.BlogControllers.updatePublishedStatus);
router.get("/:blogId/related-blogs", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), blog_controller_1.BlogControllers.getRelatedBlogs);
router.get("/:blogId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), blog_controller_1.BlogControllers.getSingleBlog);
exports.BlogRoutes = router;
//# sourceMappingURL=blog.route.js.map