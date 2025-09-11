import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookingBookSpeakerServices } from "./bookingBookSpeaker.service";
import httpStatus from 'http-status'

const createBookingBookSpeaker = catchAsync(async (req, res) => {
    const user = req.user
    const result = await BookingBookSpeakerServices.createBookingBookSpeakerIntoDB(req.body, user as JwtPayload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `Book speaker booking request sent successfully !`,
        data: result,
    });
});
const getAllBookingBookSpeakers = catchAsync(async (req, res) => {
    const user = req.user as JwtPayload;
    const result = await BookingBookSpeakerServices.getAllBookingBookSpeakersFromDB(
        req.query,
        user.id
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Engagement history retrieved successfully!`,
        meta: result.meta,
        data: result.data,
    });
});

export const BookingBookSpeakerControllers = {
    createBookingBookSpeaker,
    getAllBookingBookSpeakers
}