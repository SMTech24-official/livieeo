import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { CourseProgressServices } from "./courseProgress.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status"

const completeVideo = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload;
    const { courseId, videoId } = req.body;
    const result = await CourseProgressServices.completeVideo(user.id, courseId, videoId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Video completed successfully",
        data: result,
    });
});

export const CourseProgressController = { completeVideo };