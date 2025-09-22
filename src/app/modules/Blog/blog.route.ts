import { Router } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import textToJSONParser from "../../middlewares/textToJsonParser";
import { BlogControllers } from "./blog.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  fileUploader.upload.array("blogImages", 5),
  textToJSONParser,
  BlogControllers.createBlog
);
router.get("/", BlogControllers.getAllBlogs);
router.get("/published-blogs", BlogControllers.getPublishedBlogs);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  fileUploader.upload.array("blogImages", 5),
  textToJSONParser,
  BlogControllers.updateBlog
);
router.delete("/:id", auth(UserRole.ADMIN), BlogControllers.deleteBlog);
router.patch(
  "/published-status/:id",
  auth(UserRole.ADMIN),
  textToJSONParser,
  BlogControllers.updatePublishedStatus
);
router.get("/:blogId/related-blogs", BlogControllers.getRelatedBlogs);
router.get("/:blogId", BlogControllers.getSingleBlog);

export const BlogRoutes = router;
