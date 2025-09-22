import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { NewsletterServices } from "./newsletter.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const saveContact = catchAsync(async (req, res) => {
  const result = await NewsletterServices.subscribeNewsletter(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Thank you so much for connect with us",
    data: result,
  });
});

export const NewsletterControllers = {
  saveContact,
};
