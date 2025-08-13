import catchAsync from "../../../shared/catchAsync";
import { BlogServices } from "./blog.service";

const createBlog = catchAsync(async (req, res) => {
    const { body, file } = req;
    const payload = body;
    const blogImage = file;

    const result = await BlogServices.createBlogIntoDB(payload, blogImage!);
    res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: result
    });
})