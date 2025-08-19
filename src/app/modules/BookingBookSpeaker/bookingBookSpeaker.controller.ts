import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookingBookSpeakerServices } from "./bookingBookSpeaker.service";
import httpStatus from 'http-status'

const createBookingBookSpeaker = catchAsync(async (req, res) => {
    const result = await BookingBookSpeakerServices.createBookingBookSpeakerIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Book speaker booking request sent successfully !`,
        data: result,
    });
});

export const BookingBookSpeakerControllers = {
    createBookingBookSpeaker
}