import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { BlogControllers } from "./blog.controller";

const router = Router();

router.post("/create", fileUploader.upload.array("blogImages", 5),textToJSONParser,BlogControllers.createBlog)
router.get("/", BlogControllers.getAllBlogs);
router.get("/published-blogs", BlogControllers.getPublishedBlogs);
router.patch("/:id", fileUploader.upload.array("blogImages", 5),textToJSONParser, BlogControllers.updateBlog);
router.delete("/:id", BlogControllers.deleteBlog);
router.patch("/published-status/:id", textToJSONParser, BlogControllers.updatePublishedStatus);
router.get("/:blogId/related-blogs", BlogControllers.getRelatedBlogs)
router.get("/:blogId", BlogControllers.getSingleBlog)

export const BlogRoutes = router;