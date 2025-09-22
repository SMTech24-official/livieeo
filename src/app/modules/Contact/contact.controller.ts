import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ContactServices } from "./contact.service";
import httpStatus from "http-status";

const saveContact = catchAsync(async (req, res) => {
  const result = await ContactServices.saveContactIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Thank you so much for connect with us",
    data: result,
  });
});

export const ContactControllers = {
  saveContact,
};
